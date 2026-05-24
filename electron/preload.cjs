const {
  contextBridge,
  ipcRenderer,
} = require("electron");

contextBridge.exposeInMainWorld(
  "electronAPI",

  {

    // =========================
    // WATCHER
    // =========================

    startExcelWatch:
      (
        filePath
      ) =>
        ipcRenderer.invoke(
          "start-excel-watch",
          filePath
        ),

    onExcelUpdated:
      (
        callback
      ) => {

        ipcRenderer.on(
          "excel-file-updated",

          (
            event,
            filePath
          ) => {

            callback(
              filePath
            );
          }
        );
      },

    // =========================
    // READ
    // =========================

    readExcelFile:
      (
        filePath
      ) =>
        ipcRenderer.invoke(
          "read-excel-file",
          filePath
        ),

    // =========================
    // WRITE
    // =========================

    saveWorkbookSheet:
      (
        payload
      ) =>
        ipcRenderer.invoke(
          "save-workbook-sheet",
          payload
        ),
  }
);