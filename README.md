# Smart Comment for VS Code & Antigravity IDE

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.80.0+-blue.svg)](https://code.visualstudio.com/)
[![Author](https://img.shields.io/badge/Author-Yusuf%20Alhelou-10b981.svg)](https://github.com/yusufalhelou)

> **Context-aware commenting that actually understands JSX embedded in HTML, Babel script tags, React components, CSS, and JavaScript.**

---

## 🎯 The Problem

When working on modern single-page applications, micro-frontends, or monolithic architectures where React JSX is embedded inside an HTML document (e.g., `<script type="text/babel">`), standard IDE comment shortcuts (`Ctrl+/`) consistently fail:

- **HTML comments (`<!-- ... -->`)** crash Babel with `SyntaxError: Unexpected token '<'`.
- **JS line comments (`//`)** inside JSX render as literal text nodes in the DOM.
- Existing extensions check only the file extension (`.html`) and insert the wrong comment syntax.

**Smart Comment** eliminates this friction by inspecting the exact syntactic context of your selection and applying the correct commenting syntax dynamically.

---

## ✨ Features

- **React JSX Children:** Automatically wraps elements with `{/* ... */}` while preserving all base indentation.
- **React JSX Tag Attributes:** Comments attributes inside opening tags with `/* ... */`.
- **Pure JavaScript:** Comments functions, hooks, and variables with `//` or block comments.
- **Pure HTML:** Comments markup outside script blocks with `<!-- ... -->`.
- **CSS / Stylesheets:** Comments styles inside `<style>` tags or `.css` files with `/* ... */`.
- **Seamless 2-Way Toggle:** Pressing the shortcut on already-commented code uncomments it cleanly, restoring the exact original markup and indentation.
- **Zero Dependencies:** Pure vanilla JavaScript runtime for maximum performance and zero overhead.

---

## ⌨️ Controls & Shortcuts

| Action | Shortcut (Windows/Linux) | Shortcut (macOS) | Alternate |
| :--- | :--- | :--- | :--- |
| **Toggle Smart Comment** | `Ctrl` + `Alt` + `/` | `Cmd` + `Alt` + `/` | `Alt` + `/` |

### Also Available Via:
1. **Right-Click Context Menu:** Highlight any code ➔ Right-Click ➔ **Smart Comment / Uncomment (Context-Aware)**.
2. **Editor Header Button:** Click the comment icon `💬` at the top-right of your editor.
3. **Status Bar:** Click **`$(comment) Smart Comment`** on the bottom right status bar.
4. **Code Action (Lightbulb):** Click the `💡` lightbulb on any selection ➔ **Toggle Smart Comment**.

---

## 📊 Syntax Matrix

| File Type / Context | Comment Syntax | Example Output |
| :--- | :--- | :--- |
| **JSX Child Element** | `{/* ... */}` | `{/* <button className="btn">Click</button> */}` |
| **JSX Tag Attribute** | `/* ... */` | `<button /* onClick={handleClick} */ className="btn">` |
| **JavaScript Logic** | `// ...` | `// const [state, setState] = useState(null);` |
| **HTML Markup** | `<!-- ... -->` | `<!-- <div id="root"></div> -->` |
| **CSS Styles** | `/* ... */` | `/* .card { border-radius: 1rem; } */` |

---

## 🚀 Installation

### Option 1: Manual VSIX Install (Instant)
1. Download the latest `.vsix` from the [Releases](https://github.com/yusufalhelou/vscode-smart-comment/releases) page.
2. In VS Code or Antigravity IDE, press `Ctrl+Shift+P` ➔ **Extensions: Install from VSIX...** ➔ select the downloaded file.

### Option 2: Build from Source
```bash
git clone https://github.com/yusufalhelou/vscode-smart-comment.git
cd vscode-smart-comment
npm test
```

---

## 🧪 Testing

Run the included automated unit test suite:
```bash
node test/run_tests.js
```

---

## 👤 Author

**Yusuf Alhelou**
- GitHub: [@yusufalhelou](https://github.com/yusufalhelou)
- Email: yusufalhelou@gmail.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
