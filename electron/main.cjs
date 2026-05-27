const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Notification,
  Tray,
  Menu,
  nativeImage,
} = require("electron");

const path =
  require("path");

const fs =
  require("fs");

const chokidar =
  require("chokidar");

let mainWindow;
let tray;
let watcher;

let workbookPath =
  null;

// ========================
// CREATE WINDOW
// ========================

function createWindow() {

  mainWindow =
    new BrowserWindow({

      width: 1700,

      height: 950,

      minWidth: 1400,

      minHeight: 800,

      backgroundColor:
        "#020617",

      show: false,

      autoHideMenuBar:
        true,

      webPreferences: {

        preload:
          path.join(
            __dirname,
            "preload.cjs"
          ),

        contextIsolation:
          true,

        nodeIntegration:
          false,
      },
    });

  // ======================
  // LOAD APP
  // ======================

  mainWindow.loadURL(
    "http://localhost:5173"

  );
  mainWindow.webContents.openDevTools();
  // ======================
  // SHOW WHEN READY
  // ======================

  mainWindow.once(
    "ready-to-show",
    () => {

      mainWindow.show();

    }
  );

  // ======================
  // MINIMIZE TO TRAY
  // ======================

  mainWindow.on(
    "close",
    (event) => {

      if (
        !app.isQuiting
      ) {

        event.preventDefault();

        mainWindow.hide();

        showDesktopNotification(
          "Google Tracker",
          "Application minimized to tray."
        );
      }
    }
  );
}

// ========================
// TRAY
// ========================

function createTray() {

  const iconPath =
    path.join(
      __dirname,
      "icon.png"
    );

  const icon =
    nativeImage.createFromPath(
      iconPath
    );

  tray = new Tray(icon);

  const contextMenu =
    Menu.buildFromTemplate([

      {

        label:
          "Open Google Tracker",

        click: () => {

          mainWindow.show();
        },
      },

      {

        label:
          "Quit",

        click: () => {

          app.isQuiting =
            true;

          app.quit();
        },
      },

    ]);

  tray.setToolTip(
    "Google Tracker"
  );

  tray.setContextMenu(
    contextMenu
  );

  tray.on(
    "double-click",
    () => {

      mainWindow.show();

    }
  );
}

// ========================
// NOTIFICATIONS
// ========================

function showDesktopNotification(
  title,
  body
) {

  if (
    Notification.isSupported()
  ) {

    new Notification({

      title,
      body,

      silent: false,

    }).show();
  }
}

// ========================
// APP READY
// ========================

app.whenReady().then(
  () => {

    createWindow();

    createTray();

    // ====================
    // STARTUP NOTIFICATION
    // ====================

    setTimeout(() => {

      showDesktopNotification(
        "Google Tracker",
        "Operations platform started successfully."
      );

    }, 3000);

  }
);

// ========================
// IPC NOTIFICATIONS
// ========================

ipcMain.handle(
  "show-notification",
  async (
    event,
    payload
  ) => {

    try {

      showDesktopNotification(
        payload.title,
        payload.body
      );

      return true;

    } catch (
    error
    ) {

      console.error(
        error
      );

      return false;
    }
  }
);
ipcMain.handle(
  "read-excel-file",
  async (
    event,
    filePath
  ) => {

    try {

      const buffer =
        fs.readFileSync(
          filePath
        );

      return {

        success: true,

        data:
          buffer,
      };

    } catch (
      error
    ) {

      console.error(
        error
      );

      return {

        success: false,

        error:
          error.message,
      };
    }
  }
);
// ========================
// WORKBOOK WATCHER
// ========================

ipcMain.handle(
  "start-excel-watch",
  async (
    event,
    filePath
  ) => {

    try {

      workbookPath =
        filePath;

      if (
        watcher
      ) {

        watcher.close();
      }

      watcher =
        chokidar.watch(
          filePath,
          {

            ignoreInitial:
              true,

            persistent:
              true,
          }
        );

      watcher.on(
        "change",
        () => {

          if (
            mainWindow
          ) {

            mainWindow.webContents.send(
              "workbook-updated"
            );
          }

          showDesktopNotification(
            "Workbook Updated",
            "Excel workbook changes detected."
          );
        }
      );

      return {
        success: true,
      };

    } catch (
    error
    ) {

      console.error(
        error
      );

      return {

        success: false,

        error:
          error.message,
      };
    }
  }
);

// ========================
// SAVE WORKBOOK
// ========================

ipcMain.handle(
  "save-workbook",
  async (
    event,
    {
      path: filePath,
      buffer,
    }
  ) => {

    try {

      fs.writeFileSync(
        filePath,
        Buffer.from(
          buffer
        )
      );

      showDesktopNotification(
        "Workbook Saved",
        "Workbook changes saved successfully."
      );

      return {
        success: true,
      };

    } catch (
    error
    ) {

      console.error(
        error
      );

      return {

        success: false,

        error:
          error.message,
      };
    }
  }
);

// ========================
// OPEN FILE DIALOG
// ========================

ipcMain.handle(
  "select-workbook",

  async () => {

    const result =
      await dialog.showOpenDialog({

        properties: [
          "openFile"
        ],

        filters: [

          {
            name:
              "Excel Files",

            extensions: [
              "xlsx",
              "xls"
            ],
          },
        ],
      });

    if (
      result.canceled
    ) {

      return null;
    }

    return result.filePaths[0];
  }
);

// ========================
// WINDOW HANDLING
// ========================

app.on(
  "activate",
  () => {

    if (
      BrowserWindow.getAllWindows()
        .length === 0
    ) {

      createWindow();

    } else {

      mainWindow.show();
    }
  }
);

// ========================
// PREVENT QUIT
// ========================

app.on(
  "before-quit",
  () => {

    app.isQuiting =
      true;
  }
);

// ========================
// KEEP RUNNING
// ========================

app.on(
  "window-all-closed",
  () => {

    // DO NOTHING
    // KEEP APP IN BACKGROUND
  }
);