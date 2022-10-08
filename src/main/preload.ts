import { contextBridge, ipcRenderer } from 'electron';

const API = {
  startWebWorker: () => ipcRenderer.send('start-webworker', ''),
  terminateWebWorker: () => ipcRenderer.send('terminate-webworker', ''),
};

contextBridge.exposeInMainWorld('api', API);
