import { ipcMain } from 'electron';
import os from 'node:os';

let perc = '...'; // getCpuPercentage()

export function ipcMainProcess() {
  ipcMain.handle('get-ram-info', () => {
    const os_free_mem = os.freemem();
    const free_mem = (Math.round(os_free_mem / (1024 * 1024)));
    const os_total_mem = os.totalmem();
    const total_mem = (Math.round(os_total_mem / (1024 * 1024)));

    return `FREE ${free_mem} GB / TOTAL ${total_mem} GB`;
  });

  ipcMain.handle('get-cpu-usage', () => {
    // const { user, system } = process.cpuUsage();
    cpuUsage(res => perc = res, -1, 2000);
    return `${perc}%`; //  USER ${user} ms, SYSTEM ${system} ms`;
  });
}

/**
 * https://stackoverflow.com/a/65952194
 *
 * @description Measure the CPU usage calculated between two different CPU usage samples
 * @param {function} cb A callback function the result is passed to
 * @param {number} [core=-1] The CPU core index to measure. When is not greater than -1 then it is "averaged" for all CPU cores.
 * @param {number} [sampleMs=1000]  The number of milliseconds between the CPU usage samples
 */
function cpuUsage(cb, core, sampleMs) {
  let deltaUsed;
  let deltaIdle;
  const timesKeys = ['user', 'nice', 'sys', 'irq'];

  const allCores = core === null || !(core > -1);

  const byCore = (cpu, i) => allCores || core === i;

  const bySampleKey = (sample, key) => sample.filter(byCore).reduce((sum, cpu) => sum + cpu.times[key], 0);

  const sample0 = os.cpus();

  setTimeout(function () {
    const sample1 = os.cpus();

    deltaUsed = timesKeys.reduce(
      (diff, key) => diff + bySampleKey(sample1, key) - bySampleKey(sample0, key), 0);

    deltaIdle = bySampleKey(sample1, 'idle') - bySampleKey(sample0, 'idle');

    if (typeof cb === 'function') {
      cb(Math.round(100 * (deltaUsed / (deltaUsed + deltaIdle))));
    }
  }, sampleMs || 1000);
}
