// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // We'll use localStorage in the renderer process instead
});

contextBridge.exposeInMainWorld('electron', {
  saveImage: (base64Data, filename, originalUrl) => 
    ipcRenderer.invoke('save-image', base64Data, filename, originalUrl)
});
