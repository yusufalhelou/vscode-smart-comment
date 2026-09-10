# Smart Comment for VS Code & Antigravity IDE

<div align="center">
  <img src="icon.png" width="128" height="128" alt="Smart Comment Logo" />
  <br />
  <br />

  [![VS Code Marketplace](https://img.shields.io/badge/VS_Code_Marketplace-v1.0.1-10b981?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=yusufalhelou.vscode-smart-comment)
  [![GitHub Release](https://img.shields.io/github/v/release/yusufalhelou/vscode-smart-comment?color=06b6d4&label=Release)](https://github.com/yusufalhelou/vscode-smart-comment/releases)
  [![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
  [![Author](https://img.shields.io/badge/Author-Yusuf%20Alhelou-10b981.svg)](https://github.com/yusufalhelou)

  <p align="center">
    <strong>Context-aware commenting that actually understands JSX embedded in HTML, Babel script tags, React components, CSS, and JavaScript.</strong>
  </p>

  [**Install from Marketplace**](https://marketplace.visualstudio.com/items?itemName=yusufalhelou.vscode-smart-comment) • [**Report Bug**](https://github.com/yusufalhelou/vscode-smart-comment/issues) • [**Download VSIX**](https://github.com/yusufalhelou/vscode-smart-comment/releases)
</div>

---

## 🎯 The Problem

When working on modern single-page applications, micro-frontends, or monolithic architectures where React JSX is embedded inside an HTML document (e.g., `<script type="text/babel">`), standard IDE comment shortcuts (`Ctrl+/`) consistently fail:

- **HTML comments (`<!-- ... -->`)** crash Babel with `SyntaxError: Unexpected token '<'`.
- **JS line comments (`//`)** inside JSX render as literal text nodes in the DOM.
- Existing extensions check only the file extension (`.html`) and insert the wrong comment syntax.

**Smart Comment** eliminates this friction by inspecting the exact syntactic context of your cursor or selection and applying the correct commenting syntax dynamically.

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

## 🚀 Installation

### Option 1: Official Marketplace (Recommended)

In **VS Code** or **Antigravity IDE**:
1. Press `Ctrl+P` (or `Cmd+P`), paste the following command, and press **Enter**:
   ```bash
   ext install yusufalhelou.vscode-smart-comment
   ```
2. *Or* open the **Extensions** view (`Ctrl+Shift+X`), search for **`Smart Comment`** (by **Yusuf Alhelou**), and click **Install**.

👉 **[View on Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=yusufalhelou.vscode-smart-comment)**

---

### Option 2: Manual VSIX Installation

In **VS Code** or **Antigravity IDE**:
1. Download the latest `.vsix` package from the [Releases](https://github.com/yusufalhelou/vscode-smart-comment/releases) tab.
2. In **VS Code** or **Antigravity IDE**, press `Ctrl+Shift+P` (or `Cmd+Shift+P`).
3. Choose **Extensions: Install from VSIX...** and select the downloaded file.

---

## ⌨️ Controls & Shortcuts

| Action | Shortcut (Windows/Linux) | Shortcut (macOS) | Alternate |
| :--- | :--- | :--- | :--- |
| **Toggle Smart Comment** | `Ctrl` + `Alt` + `/` | `Cmd` + `Alt` + `/` | `Alt` + `/` |

### Also Available Via:
1. **Right-Click Context Menu:** Highlight any code ➔ Right-Click ➔ **Smart Comment / Uncomment (Context-Aware)**.
2. **Editor Header Button:** Click the comment icon `💬` at the top-right of your editor tab.
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

## 🧪 Testing

Run the included automated unit test suite:
```bash
node test/run_tests.js
```

---

## 👤 Author

**Yusuf Alhelou**
- GitHub: [@yusufalhelou](https://github.com/yusufalhelou)
- Marketplace: [yusufalhelou](https://marketplace.visualstudio.com/publishers/yusufalhelou)
- Contact: contact@yusufalhelou.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
