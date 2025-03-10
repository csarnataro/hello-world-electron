const { contextBridge, ipcRenderer } = require('electron');

/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  getRamInfo: async () => {
    console.log('[*] renderer -> preload, preload receive ram info request from renderer');
    const result = await ipcRenderer.invoke('get-ram-info');
    return result;
  },
  getCpuUsage: async () => {
    const result = await ipcRenderer.invoke('get-cpu-usage');
    return result;
  }
});
