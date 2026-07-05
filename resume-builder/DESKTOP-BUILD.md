# Resume Builder - Windows Desktop OS Mode 🖥️

This project is fully configured to be compiled into a native Windows executable (`.exe`) application, allowing you to run it directly on Windows without a browser!

## How to Package as a Windows App (`.exe` Installer)

To compile the application into a standalone Windows installer, follow these quick steps on your PC:

1. **Extract the Project**: Export this project as a ZIP file from AI Studio, and extract it on your local machine.
2. **Install Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed on your Windows machine.
3. **Open Terminal**: Open Command Prompt (cmd) or PowerShell in the extracted folder.
4. **Install Dependencies**: Run the following command:
   ```bash
   npm install
   ```
5. **Build the `.exe` Installer**: Run the following single build command:
   ```bash
   npm run electron:build
   ```

After the build finishes, you will find your compiled Windows executable installer in the newly created `dist_electron/` directory:
- `dist_electron/Resume Builder Setup 0.0.0.exe` (A professional Windows installer that adds shortcuts to your Desktop and Start Menu)
- `dist_electron/Resume Builder 0.0.0.exe` (A fully portable executable version that runs instantly)

---

## Native Desktop Shell Enhancements
The Electron app includes Windows-specific OS optimizations:
- ⚡ **Auto-Maximization**: Opens in full focus on launch.
- 🖨️ **Ctrl+P Print shortcut**: Automatically triggers the system Print dialog to save the resume as PDF.
- 🔄 **Ctrl+R Refresh shortcut**: Instantly updates the content.
- 💾 **Local Data Persistence**: Stored local resume profiles map to Windows user profile application storage.
- 🎨 **Window Isolation**: Runs in its own separate process window, without any browser margins.
