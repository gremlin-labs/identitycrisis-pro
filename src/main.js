// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  // Set app icon path based on platform
  let iconPath;
  if (process.platform === 'darwin') {
    // macOS uses .icns format, but we can use PNG as well
    iconPath = path.join(__dirname, '..', 'public', 'icons', 'Icon-512.png');
  } else if (process.platform === 'win32') {
    // Windows uses .ico format, but we can use PNG as well
    iconPath = path.join(__dirname, '..', 'public', 'icons', 'Icon-256.png');
  } else {
    // Linux uses .png format
    iconPath = path.join(__dirname, '..', 'public', 'icons', 'Icon-512.png');
  }

  const win = new BrowserWindow({
    width: 900,
    height: 785,
    minWidth: 900,
    minHeight: 785,
    title: 'IdentityCrisis Pro',
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allow loading local resources
    },
    show: false,
  });

  // Open DevTools for debugging
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }

  win.once('ready-to-show', () => win.show());

  // Determine if we're in development or production mode
  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
  
  if (isDev) {
    // Development mode - load from Vite dev server
    const devUrl = 'http://localhost:3000';
    console.log('Loading from dev server:', devUrl);
    win.loadURL(devUrl);
  } else {
    // Production mode - load from built files
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('Loading index from:', indexPath);
    win.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  // Set dock icon for macOS
  if (process.platform === 'darwin') {
    const dockIconPath = path.join(__dirname, '..', 'public', 'icons', 'Icon-512.png');
    app.dock.setIcon(dockIconPath);
  }

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC handlers for image storage
const getIdentityCrisisProFolder = () => {
  const homeDir = app.getPath('home');
  const identityCrisisProDir = path.join(homeDir, 'IdentityCrisis Pro');
  const imagesDir = path.join(identityCrisisProDir, 'images');
  
  // Create directories if they don't exist
  if (!fs.existsSync(identityCrisisProDir)) {
    fs.mkdirSync(identityCrisisProDir, { recursive: true });
  }
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  return imagesDir;
};

ipcMain.handle('save-image', async (event, base64Data, filename, originalUrl) => {
  try {
    const imagesDir = getIdentityCrisisProFolder();
    
    // Extract file extension from URL or default to .png
    const urlParts = originalUrl.split('.');
    const extension = urlParts.length > 1 ? `.${urlParts[urlParts.length - 1].split('?')[0]}` : '.png';
    const safeFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_') + extension;
    const localPath = path.join(imagesDir, safeFilename);
    
    // Convert base64 back to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Save the image to local file
    fs.writeFileSync(localPath, buffer);
    
    console.log(`Image saved locally: ${localPath}`);
    return localPath;
    
  } catch (error) {
    console.error('Error saving image in main process:', error);
    throw error;
  }
});
