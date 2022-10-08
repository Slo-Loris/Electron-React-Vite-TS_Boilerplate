import { app, BrowserWindow, Menu, webContents, ipcMain } from 'electron';
import { join } from 'path';
import { Worker } from 'worker_threads';

app.disableHardwareAcceleration();

const env = process.env.NODE_ENV;

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 1800,
    height: 1200,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
    },
  });

  let childWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    show: false,
    modal: true,
    movable: true,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
    },
  });

  env === 'development' ? mainWindow.loadURL('http://127.0.0.1:3000/') : mainWindow.loadURL(`file://${join(__dirname, '..', 'renderer/index.html')}`);

  const openLoginWindow = () => {
    childWindow.show();
    childWindow.loadFile(join(__dirname, './static/index.html'));
  };

  childWindow.on('close', (e) => {
    e.preventDefault();
    childWindow.hide();
  });

  ipcMain.on('start-webworker', () => {
    const worker = new Worker(join(__dirname, './workers/worker.js'));

    const terminateWorkerThread = (worker: Worker) => {
      worker.terminate().then(() => {
        console.log('Worker killed');
      });
    };

    ipcMain.on('terminate-webworker', () => {
      terminateWorkerThread(worker);
    });

    worker.on('message', (msg) => {
      console.log(msg);
      terminateWorkerThread(worker);
    });

    console.log(`From main thread: I am main thread`);
  });

  const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open child window',
          click() {
            openLoginWindow();
          },
        },
      ],
    },
    {
      label: 'DevTools',
      submenu: [
        {
          label: 'Open DevTools',
          click() {
            webContents.getFocusedWebContents().openDevTools();
          },
        },
      ],
    },
  ];

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
};

app.whenReady().then(() => {
  createWindow();
});
