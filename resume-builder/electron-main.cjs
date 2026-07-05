const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    title: 'Resume Builder',
    icon: path.join(__dirname, 'src/assets/images/app_icon.jpg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // In production, load the built index.html. In development, load localhost:3000
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Automatically maximize on Windows if desired
  mainWindow.maximize();
}

app.on('ready', () => {
  createWindow();

  // Register Windows-friendly global shortcuts
  globalShortcut.register('CommandOrControl+P', () => {
    if (mainWindow) {
      mainWindow.webContents.print({ silent: false, printBackground: true });
    }
  });

  globalShortcut.register('CommandOrControl+R', () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
