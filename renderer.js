/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const ramIndicator = document.getElementById('txt-ram-indicator');
const cpuIndicator = document.getElementById('txt-cpu-indicator');

setInterval(async () => {
  const ramInfo = await window.electronAPI?.getRamInfo();
  const cpuUage = await window.electronAPI?.getCpuUsage();
  if (ramIndicator) ramIndicator.innerText = ramInfo;
  if (cpuIndicator) cpuIndicator.innerText = cpuUage;
}, 2000);
