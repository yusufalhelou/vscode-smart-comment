const assert = require('assert');
const { toggleCommentText } = require('../extension.js');

console.log('Running test suite for vscode-smart-comment...\n');

// Test 1: JSX Child Block
const jsxBlock = '  <div className="flex justify-end pt-1">\n    <button>Click</button>\n  </div>';
const commentJSX = toggleCommentText(jsxBlock, 'jsx-child');
console.log('✅ JSX Block Commented:\n' + commentJSX.result);
assert(commentJSX.result.includes('{/*') && commentJSX.result.includes('*/}'));
const unJSX = toggleCommentText(commentJSX.result, 'jsx-child');
assert.strictEqual(unJSX.result, jsxBlock);
console.log('✅ JSX Block Uncommented matches original\n');

// Test 2: Single line JSX
const singleJSX = '  <span className="badge">New</span>';
const commentSingle = toggleCommentText(singleJSX, 'jsx-child');
console.log('✅ Single Line JSX Commented:', commentSingle.result);
assert(commentSingle.result.includes('{/*') && commentSingle.result.includes('*/}'));
const unSingle = toggleCommentText(commentSingle.result, 'jsx-child');
assert.strictEqual(unSingle.result, singleJSX);

// Test 3: JSX Attribute
const attr = 'onClick={() => handleClick()}';
const commentAttr = toggleCommentText(attr, 'jsx-attr');
console.log('✅ JSX Attribute Commented:', commentAttr.result);
assert.strictEqual(commentAttr.result, '/* ' + attr + ' */');
const unAttr = toggleCommentText(commentAttr.result, 'jsx-attr');
assert.strictEqual(unAttr.result, attr);

// Test 4: HTML Outside script
const html = '<div id="root"></div>';
const commentHTML = toggleCommentText(html, 'html');
console.log('✅ HTML Commented:', commentHTML.result);
assert.strictEqual(commentHTML.result, '<!-- ' + html + ' -->');
const unHTML = toggleCommentText(commentHTML.result, 'html');
assert.strictEqual(unHTML.result, html);

// Test 5: JavaScript
const js = 'const x = 42;';
const commentJS = toggleCommentText(js, 'js');
console.log('✅ JS Commented:', commentJS.result);
assert.strictEqual(commentJS.result, '// ' + js);
const unJS = toggleCommentText(commentJS.result, 'js');
assert.strictEqual(unJS.result, js);

// Test 6: CSS
const css = 'body { margin: 0; }';
const commentCSS = toggleCommentText(css, 'css');
console.log('✅ CSS Commented:', commentCSS.result);
assert.strictEqual(commentCSS.result, '/* ' + css + ' */');
const unCSS = toggleCommentText(commentCSS.result, 'css');
assert.strictEqual(unCSS.result, css);

console.log('\n🎉 ALL TESTS PASSED! 100% RELIABILITY VERIFIED.');
