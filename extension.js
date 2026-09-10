let vscode;
try {
  vscode = require('vscode');
} catch (e) {
  // Standalone test environment outside VS Code host
}

/**
 * Detects the syntactic context of the text at the given offset within the document.
 * @param {vscode.TextDocument} document
 * @param {number} startOffset
 * @param {string} selectedText
 * @returns {'jsx-child' | 'jsx-attr' | 'js' | 'html' | 'css'}
 */
function detectContext(document, startOffset, selectedText) {
  const docText = document.getText();
  const ext = (document.fileName.split('.').pop() || '').toLowerCase();
  const langId = (document.languageId || '').toLowerCase();

  // 1. Pure CSS / SCSS / LESS
  if (['css', 'scss', 'less'].includes(langId) || ['css', 'scss', 'less'].includes(ext)) {
    return 'css';
  }

  // 2. Pure JSX / TSX
  if (['javascriptreact', 'typescriptreact'].includes(langId) || ['jsx', 'tsx'].includes(ext)) {
    const trimmed = selectedText.trim();
    if (/^<[A-Za-z0-9_.\$]+|<\/|<\/?>/.test(trimmed)) {
      return 'jsx-child';
    }
    const textBefore = docText.slice(0, startOffset);
    const lastTagOpen = textBefore.lastIndexOf('<');
    const lastTagClose = textBefore.lastIndexOf('>');
    if (lastTagOpen > lastTagClose) {
      return 'jsx-attr';
    }
    return 'js';
  }

  // 3. HTML or embedded HTML (e.g. monolithic HTML with <script type="text/babel">)
  if (langId === 'html' || ext === 'html' || ext === 'htm') {
    const textBefore = docText.slice(0, startOffset);

    // Inside <style>
    const lastStyleOpen = textBefore.lastIndexOf('<style');
    const lastStyleClose = textBefore.lastIndexOf('</style>');
    if (lastStyleOpen !== -1 && lastStyleOpen > lastStyleClose) {
      return 'css';
    }

    // Inside <script>
    const lastScriptOpen = textBefore.lastIndexOf('<script');
    const lastScriptClose = textBefore.lastIndexOf('</script>');
    if (lastScriptOpen !== -1 && lastScriptOpen > lastScriptClose) {
      const scriptTagSnippet = textBefore.slice(lastScriptOpen, docText.indexOf('>', lastScriptOpen) + 1);
      const isBabel = /type\s*=\s*["']text\/babel["']/i.test(scriptTagSnippet);

      const trimmed = selectedText.trim();

      // Starts with JSX element or fragment: <div, <button, </div, <>, <React.Fragment
      if (/^<[A-Za-z0-9_.\$]+|<\/|<\/?>/.test(trimmed)) {
        return 'jsx-child';
      }

      // Inside JSX opening tag attributes: between <tag and >
      const lastTagOpen = textBefore.lastIndexOf('<');
      const lastTagClose = textBefore.lastIndexOf('>');
      if (lastTagOpen > lastTagClose) {
        const tagContent = textBefore.slice(lastTagOpen);
        if (/^<[A-Za-z0-9_.\$]+[\s\S]*$/.test(tagContent)) {
          return 'jsx-attr';
        }
      }

      // Inside return ( ... ) or JSX container
      const lastReturn = Math.max(textBefore.lastIndexOf('return ('), textBefore.lastIndexOf('return <'));
      if (lastReturn !== -1) {
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          return 'jsx-child';
        }
      }

      // If Babel script and contains markup characters, default to JSX child
      if (isBabel) {
        if (trimmed.includes('<') && trimmed.includes('>')) {
          return 'jsx-child';
        }
      }

      return 'js';
    }

    // Outside script and style in HTML
    return 'html';
  }

  // 4. Default for JS/TS
  if (['javascript', 'typescript'].includes(langId) || ['js', 'ts', 'mjs', 'cjs'].includes(ext)) {
    const trimmed = selectedText.trim();
    if (/^<[A-Za-z0-9_.\$]+|<\/|<\/?>/.test(trimmed)) {
      return 'jsx-child';
    }
    return 'js';
  }

  return 'js';
}

/**
 * Toggles comment on text based on syntactic context.
 * @param {string} text
 * @param {'jsx-child' | 'jsx-attr' | 'js' | 'html' | 'css'} context
 * @returns {{ result: string, action: 'commented' | 'uncommented', mode: string }}
 */
function toggleCommentText(text, context) {
  const trimmed = text.trim();

  // ============================
  // 1. UNCOMMENT CHECKS
  // ============================

  // A. JSX comment: {/* ... */}
  if (trimmed.startsWith('{/*') && trimmed.endsWith('*/}')) {
    const match = text.match(/^(\s*)\{\/\*([\s\S]*?)\*\/\}(\s*)$/);
    if (match) {
      const leading = match[1];
      let inner = match[2];
      const trailing = match[3];

      if (inner.startsWith(' ') && inner.endsWith(' ')) {
        inner = inner.slice(1, -1);
      } else if (inner.startsWith('\n') && inner.endsWith('\n')) {
        inner = inner.slice(1, -1);
      } else if (inner.startsWith('\r\n') && inner.endsWith('\r\n')) {
        inner = inner.slice(2, -2);
      }
      return { result: leading + inner + trailing, action: 'uncommented', mode: 'JSX' };
    }
  }

  // B. HTML comment: <!-- ... -->
  if (trimmed.startsWith('<!--') && trimmed.endsWith('-->')) {
    const match = text.match(/^(\s*)<!--([\s\S]*?)-->(\s*)$/);
    if (match) {
      let inner = match[2];
      if (inner.startsWith(' ') && inner.endsWith(' ')) {
        inner = inner.slice(1, -1);
      }
      return { result: match[1] + inner + match[3], action: 'uncommented', mode: 'HTML' };
    }
  }

  // C. Block comment: /* ... */
  if (trimmed.startsWith('/*') && trimmed.endsWith('*/')) {
    const match = text.match(/^(\s*)\/\*([\s\S]*?)\*\/\s*$/);
    if (match) {
      let inner = match[2];
      if (inner.startsWith(' ') && inner.endsWith(' ')) {
        inner = inner.slice(1, -1);
      }
      return { result: match[1] + inner, action: 'uncommented', mode: 'Block' };
    }
  }

  // D. Line comments: // on all non-empty lines
  const lines = text.split(/\r?\n/);
  const nonEmpty = lines.filter(l => l.trim().length > 0);
  if (nonEmpty.length > 0 && nonEmpty.every(l => /^\s*\/\//.test(l))) {
    const un = lines.map(l => l.replace(/^(\s*)\/\/\s?/, '$1')).join('\n');
    return { result: un, action: 'uncommented', mode: 'Line' };
  }

  // ============================
  // 2. COMMENT CHECKS
  // ============================

  // JSX Child Elements: {/* ... */}
  if (context === 'jsx-child') {
    const firstLine = lines.find(l => l.trim().length > 0) || lines[0];
    const indentMatch = firstLine.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : '';

    return { result: indent + '{/* ' + text.trim() + ' */}', action: 'commented', mode: 'JSX' };
  }

  // JSX Tag Attributes or CSS: /* ... */
  if (context === 'jsx-attr' || context === 'css') {
    return { result: '/* ' + text + ' */', action: 'commented', mode: context === 'css' ? 'CSS' : 'JSX Attribute' };
  }

  // Standard HTML: <!-- ... -->
  if (context === 'html') {
    return { result: '<!-- ' + text + ' -->', action: 'commented', mode: 'HTML' };
  }

  // JavaScript statements: // ...
  if (context === 'js') {
    const commentedLines = lines.map(l => l.trim().length > 0 ? '// ' + l : l).join('\n');
    return { result: commentedLines, action: 'commented', mode: 'JavaScript' };
  }

  return { result: text, action: 'commented', mode: 'Default' };
}

/**
 * Main execution handler for toggling smart comment on active editor.
 */
async function executeSmartComment() {
  if (!vscode) return;
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('Smart Comment: No active editor.');
    return;
  }

  const document = editor.document;
  const selection = editor.selection;

  let targetRange;
  let textToProcess;

  if (selection.isEmpty) {
    // Single line at cursor position
    const line = document.lineAt(selection.start.line);
    targetRange = line.range;
    textToProcess = line.text;
  } else {
    // Multi-line selection: expand to cover full lines
    if (selection.start.line !== selection.end.line) {
      const startLine = document.lineAt(selection.start.line);
      const endLine = document.lineAt(selection.end.line);
      targetRange = new vscode.Range(startLine.range.start, endLine.range.end);
      textToProcess = document.getText(targetRange);
    } else {
      // Single line partial selection
      const line = document.lineAt(selection.start.line);
      if (selection.isEqual(line.range) || selection.contains(line.range)) {
        targetRange = line.range;
        textToProcess = line.text;
      } else {
        targetRange = selection;
        textToProcess = document.getText(selection);
      }
    }
  }

  const startOffset = document.offsetAt(targetRange.start);
  const context = detectContext(document, startOffset, textToProcess);
  const { result, action, mode } = toggleCommentText(textToProcess, context);

  await editor.edit(editBuilder => {
    editBuilder.replace(targetRange, result);
  });

  // Keep selection over the new text so consecutive toggles work immediately
  const newEndPos = document.positionAt(document.offsetAt(targetRange.start) + result.length);
  editor.selection = new vscode.Selection(targetRange.start, newEndPos);

  // Status bar feedback
  const icon = action === 'commented' ? '$(comment)' : '$(reply)';
  vscode.window.setStatusBarMessage(`${icon} Smart Comment: ${action.toUpperCase()} [${mode}]`, 3000);
}

/**
 * Extension activation
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  if (!vscode) return;

  // 1. Register main command
  const disposableCommand = vscode.commands.registerCommand('smartComment.toggle', executeSmartComment);
  context.subscriptions.push(disposableCommand);

  // 2. Register Status Bar item
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'smartComment.toggle';
  statusBarItem.text = '$(comment) Smart Comment';
  statusBarItem.tooltip = 'Smart Comment: Toggle Context-Aware Comment (JSX, HTML, JS, CSS) [Ctrl+Alt+/]';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // 3. Register Code Action (Quick Fix / Refactor lightbulb)
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    ['html', 'javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'css'],
    {
      provideCodeActions(document, range) {
        const action = new vscode.CodeAction('💡 Toggle Smart Comment (Context-Aware)', vscode.CodeActionKind.Refactor);
        action.command = {
          command: 'smartComment.toggle',
          title: 'Toggle Smart Comment'
        };
        return [action];
      }
    }
  );
  context.subscriptions.push(codeActionProvider);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  detectContext,
  toggleCommentText
};
