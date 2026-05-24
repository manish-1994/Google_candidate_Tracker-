const {
  app,
  BrowserWindow,
  ipcMain,
} = require("electron");

const path =
  require("path");

const fs =
  require("fs");

const chokidar =
  require("chokidar");

const ExcelJS =
  require("exceljs");

let mainWindow;

const isDev =
  !app.isPackaged;

// =========================
// LOOP PROTECTION
// =========================

let isInternalWorkbookUpdate =
  false;

// =========================
// WINDOW
// =========================

function createWindow() {

  mainWindow =
    new BrowserWindow({

      width: 1800,

      height: 1100,

      minWidth: 1400,

      minHeight: 900,

      backgroundColor:
        "#020617",

      autoHideMenuBar:
        true,

      webPreferences: {

        preload:
          path.resolve(
            __dirname,
            "preload.cjs"
          ),

        contextIsolation:
          true,

        nodeIntegration:
          false,

        sandbox:
          false,
      },
    });

  if (isDev) {

    mainWindow.loadURL(
      "http://localhost:5173"
    );

    mainWindow.webContents.openDevTools({
      mode: "detach",
    });

  } else {

    mainWindow.loadFile(
      path.join(
        __dirname,
        "../dist/index.html"
      )
    );
  }

  mainWindow.on(
    "closed",
    () => {

      mainWindow =
        null;
    }
  );
}

app.whenReady().then(
  () => {

    createWindow();

    app.on(
      "activate",
      () => {

        if (
          BrowserWindow.getAllWindows()
            .length === 0
        ) {

          createWindow();
        }
      }
    );
  }
);

app.on(
  "window-all-closed",
  () => {

    if (
      process.platform !==
      "darwin"
    ) {

      app.quit();
    }
  }
);

// =========================
// WATCH EXCEL FILE
// =========================

let watcher = null;

ipcMain.handle(
  "start-excel-watch",

  async (
    event,
    filePath
  ) => {

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
        }
      );

    let syncTimeout = null;

    watcher.on(
      "change",

      () => {

        // IGNORE SELF WRITES

        if (
          isInternalWorkbookUpdate
        ) {

          console.log(
            "Ignoring internal workbook update"
          );

          return;
        }

        console.log(
          "Workbook changed"
        );

        clearTimeout(
          syncTimeout
        );

        syncTimeout =
          setTimeout(
            () => {

              if (
                mainWindow
              ) {

                mainWindow.webContents.send(
                  "excel-file-updated",
                  filePath
                );
              }

            },

            1200
          );
      }
    );

    return true;
  }
);

// =========================
// READ EXCEL FILE
// =========================

ipcMain.handle(
  "read-excel-file",

  async (
    event,
    filePath
  ) => {

    const buffer =
      fs.readFileSync(
        filePath
      );

    return buffer;
  }
);

// =========================
// SAVE WORKBOOK SHEET
// =========================

ipcMain.handle(
  "save-workbook-sheet",

  async (
    event,
    payload
  ) => {

    try {

      const {

        filePath,
        sheetName,
        rowData,
        columnDefs,

      } = payload;

      if (
        !filePath
      ) {

        return {
          success: false,
        };
      }

      isInternalWorkbookUpdate =
        true;

      const workbook =
        new ExcelJS.Workbook();

      await workbook.xlsx.readFile(
        filePath
      );

      let worksheet =
        workbook.getWorksheet(
          sheetName
        );

      // CREATE IF MISSING

      if (
        !worksheet
      ) {

        worksheet =
          workbook.addWorksheet(
            sheetName
          );
      }

      // =========================
      // CLEAR EXISTING
      // =========================

      worksheet.spliceRows(
        1,
        worksheet.rowCount
      );

      // =========================
      // STABLE COLUMN ORDER
      // =========================

      const headers =
        columnDefs.map(
          (
            col
          ) =>
            col.field
        );

      // HEADER ROW

      worksheet.addRow(
        headers
      );

      // DATA ROWS

      rowData.forEach(
        (
          row
        ) => {

          const values =
            headers.map(
              (
                header
              ) =>
                row[
                  header
                ] ?? ""
            );

          worksheet.addRow(
            values
          );
        }
      );

      await workbook.xlsx.writeFile(
        filePath
      );

      console.log(
        "Workbook saved"
      );

      setTimeout(
        () => {

          isInternalWorkbookUpdate =
            false;
        },

        2500
      );

      return {
        success: true,
      };

    } catch (error) {

      console.error(
        "Workbook save failed",
        error
      );

      isInternalWorkbookUpdate =
        false;

      return {
        success: false,
      };
    }
  }
);