const {
  contextBridge,
  ipcRenderer,
} = require("electron");

contextBridge.exposeInMainWorld(
  "electronAPI",
  {

    // ======================
    // NOTIFICATIONS
    // ======================

    showNotification:
      (
        title,
        body
      ) =>

        ipcRenderer.invoke(
          "show-notification",
          {
            title,
            body,
          }
        ),

    // ======================
    // WORKBOOK WATCHER
    // ======================

    startExcelWatch:
      (
        filePath
      ) =>

        ipcRenderer.invoke(
          "start-excel-watch",
          filePath
        ),

    // ======================
    // READ EXCEL FILE
    // ======================

    readExcelFile:
      (
        filePath
      ) =>

        ipcRenderer.invoke(
          "read-excel-file",
          filePath
        ),

    // ======================
    // SAVE WORKBOOK
    // ======================

    saveWorkbook:
      (
        payload
      ) =>

        ipcRenderer.invoke(
          "save-workbook",
          payload
        ),

    // ======================
    // FILE PICKER
    // ======================

    selectWorkbook:
      () =>

        ipcRenderer.invoke(
          "select-workbook"
        ),

    // ======================
    // EVENTS
    // ======================

    onWorkbookUpdated:
      (
        callback
      ) => {

        ipcRenderer.on(
          "workbook-updated",
          callback
        );
      },

    // ======================
    // EXCEL UPDATED
    // ======================

    onExcelUpdated:
      (
        callback
      ) => {

        ipcRenderer.on(
          "excel-updated",
          callback
        );
      },

  }
);