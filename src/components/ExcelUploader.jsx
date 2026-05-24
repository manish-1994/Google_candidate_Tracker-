import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ExcelJS from "exceljs";
import {
  useNavigate,
} from "react-router-dom";

import InputModal from "./InputModal";

import {
  Upload,
  Search,
} from "lucide-react";

import {
  useApp,
} from "../context/AppContext";

import {
  parseLaptopSheets,
} from "../utils/laptopParser";

import {
  parseWorksheet,
} from "../utils/excelSheetParser";

import SheetGrid from "./SheetGrid";

import SheetToolbar from "./SheetToolbar";

export default function ExcelUploader() {

  const {


    setLaptops,

    sheetsData,
    setSheetsData,

    activeSheetName,
    setActiveSheetName,

  } = useApp();

  const navigate =
    useNavigate();
  // =========================
  // MODAL STATE
  // =========================

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    modalType,
    setModalType,
  ] = useState("");

  const [
    modalValue,
    setModalValue,
  ] = useState("");

  const [
    pendingColumn,
    setPendingColumn,
  ] = useState("");

  // =========================
  // GRID STATE
  // =========================

  const [
    rowData,
    setRowData,
  ] = useState([]);

  const [
    columnDefs,
    setColumnDefs,
  ] = useState([]);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    selectedRows,
    setSelectedRows,
  ] = useState([]);

  // =========================
  // SYNC
  // =========================

  const [
    syncFilePath,
  ] = useState(
    localStorage.getItem(
      "syncFilePath"
    ) || ""
  );

  // =========================
  // LOAD WORKBOOK
  // =========================

  const loadWorkbook =
    async (
      workbook
    ) => {

      const parsedLaptops =
        parseLaptopSheets(
          workbook
        );

      setLaptops(
        parsedLaptops
      );

      const parsedSheets =
        workbook.worksheets.map(
          (
            worksheet
          ) => {

            const parsed =
              parseWorksheet(
                worksheet
              );

            return {

              name:
                worksheet.name,

              rowData:
                parsed.rowData,

              columnDefs:
                parsed.columnDefs,
            };
          }
        );

      setSheetsData(
        parsedSheets
      );

      if (
        parsedSheets.length > 0
      ) {

        setActiveSheetName(
          parsedSheets[0]
            .name
        );
      }
    };

  // =========================
  // LOAD FROM PATH
  // =========================

  const loadWorkbookFromPath =
    async (
      filePath
    ) => {

      if (
        !window.electronAPI
      ) {
        return;
      }

      try {

        const workbook =
          new ExcelJS.Workbook();

        const buffer =
          await window.electronAPI.readExcelFile(
            filePath
          );

        await workbook.xlsx.load(
          buffer
        );

        await loadWorkbook(
          workbook
        );

        console.log(
          "Workbook auto synced"
        );

      } catch (error) {

        console.error(
          "Auto sync failed",
          error
        );
      }
    };

  // =========================
  // WATCH EXCEL FILE
  // =========================

  useEffect(() => {

    if (
      !window.electronAPI
    ) {
      return;
    }

    if (
      !syncFilePath
    ) {
      return;
    }

    loadWorkbookFromPath(
      syncFilePath
    );

    window.electronAPI.onExcelUpdated(
      async (
        filePath
      ) => {

        console.log(
          "Workbook changed"
        );

        await loadWorkbookFromPath(
          filePath
        );
      }
    );

  }, []);

  // =========================
  // UPDATE CURRENT SHEET
  // =========================

  useEffect(() => {

    if (
      !activeSheetName
    ) {
      return;
    }

    const currentSheet =
      sheetsData.find(
        (
          sheet
        ) =>
          sheet.name ===
          activeSheetName
      );

    if (
      !currentSheet
    ) {
      return;
    }

    setRowData(
      currentSheet.rowData ||
      []
    );

    setColumnDefs(
      currentSheet.columnDefs ||
      []
    );

  }, [
    activeSheetName,
    sheetsData,
  ]);

  const updateCurrentSheet =
    (
      updatedRows,
      updatedColumns
    ) => {

      const updatedSheets =
        sheetsData.map(
          (
            sheet
          ) => {

            if (
              sheet.name !==
              activeSheetName
            ) {
              return sheet;
            }

            return {

              ...sheet,

              rowData:
                updatedRows,

              columnDefs:
                updatedColumns,
            };
          }
        );

      setSheetsData(
        updatedSheets
      );
    };

  // =========================
  // FILE UPLOAD
  // =========================

  const handleFileUpload =
    async (
      event
    ) => {

      const file =
        event.target.files[0];

      if (
        !file
      ) {
        return;
      }

      const workbook =
        new ExcelJS.Workbook();

      const arrayBuffer =
        await file.arrayBuffer();

      await workbook.xlsx.load(
        arrayBuffer
      );

      await loadWorkbook(
        workbook
      );
    };

  // =========================
  // GRID ACTIONS
  // =========================

  const addRow =
    () => {

      const newRow = {

        __rowId:
          crypto.randomUUID?.() ||
          `${Date.now()}`,
      };

      columnDefs.forEach(
        (
          col
        ) => {

          newRow[
            col.field
          ] = "";
        }
      );

      const updatedRows = [
        newRow,
        ...rowData,
      ];

      setRowData(
        updatedRows
      );

      updateCurrentSheet(
        updatedRows,
        columnDefs
      );
    };

  const deleteRows =
    () => {

      if (
        !selectedRows.length
      ) {
        return;
      }

      const selectedIds =
        selectedRows.map(
          (
            row
          ) =>
            row.__rowId
        );

      const updatedRows =
        rowData.filter(
          (
            row
          ) =>
            !selectedIds.includes(
              row.__rowId
            )
        );

      setSelectedRows(
        []
      );

      setRowData(
        updatedRows
      );

      updateCurrentSheet(
        updatedRows,
        columnDefs
      );
    };

  const addColumn =
    () => {

      setModalType(
        "add"
      );

      setModalValue("");

      setModalOpen(
        true
      );
    };

  const deleteColumn =
    () => {

      setModalType(
        "delete"
      );

      setModalValue("");

      setModalOpen(
        true
      );
    };

  const renameColumn =
    (
      oldField
    ) => {

      setPendingColumn(
        oldField
      );

      setModalType(
        "rename"
      );

      setModalValue(
        oldField
      );

      setModalOpen(
        true
      );
    };

  // =========================
  // MODAL CONFIRM
  // =========================

  const handleModalConfirm =
    (
      value
    ) => {

      // ADD COLUMN

      if (
        modalType ===
        "add"
      ) {

        const updatedColumns =
          [
            ...columnDefs,

            {
              field:
                value,

              headerName:
                value,

              editable:
                true,

              sortable:
                true,

              filter:
                true,

              floatingFilter:
                true,

              resizable:
                true,
            },
          ];

        const updatedRows =
          rowData.map(
            (
              row
            ) => ({

              ...row,

              [value]:
                "",
            })
          );

        setColumnDefs(
          updatedColumns
        );

        setRowData(
          updatedRows
        );

        updateCurrentSheet(
          updatedRows,
          updatedColumns
        );
      }

      // DELETE COLUMN

      if (
        modalType ===
        "delete"
      ) {

        const updatedColumns =
          columnDefs.filter(
            (
              col
            ) =>
              col.field !==
              value
          );

        const updatedRows =
          rowData.map(
            (
              row
            ) => {

              const updated =
              {
                ...row,
              };

              delete updated[
                value
              ];

              return updated;
            }
          );

        setColumnDefs(
          updatedColumns
        );

        setRowData(
          updatedRows
        );

        updateCurrentSheet(
          updatedRows,
          updatedColumns
        );
      }

      // RENAME COLUMN

      if (
        modalType ===
        "rename"
      ) {

        const updatedColumns =
          columnDefs.map(
            (
              col
            ) => {

              if (
                col.field ===
                pendingColumn
              ) {

                return {

                  ...col,

                  field:
                    value,

                  headerName:
                    value,
                };
              }

              return col;
            }
          );

        const updatedRows =
          rowData.map(
            (
              row
            ) => {

              const updated =
              {
                ...row,
              };

              updated[
                value
              ] =
                updated[
                pendingColumn
                ];

              delete updated[
                pendingColumn
              ];

              return updated;
            }
          );

        setColumnDefs(
          updatedColumns
        );

        setRowData(
          updatedRows
        );

        updateCurrentSheet(
          updatedRows,
          updatedColumns
        );
      }

      setModalOpen(
        false
      );
    };

  // =========================
  // CELL UPDATE
  // =========================

  let workbookSaveTimeout =
    null;

  const debouncedWorkbookSave =
    (
      updatedRows,
      updatedColumns
    ) => {

      if (
        !window.electronAPI
      ) {
        return;
      }

      if (
        !syncFilePath
      ) {
        return;
      }

      clearTimeout(
        workbookSaveTimeout
      );

      workbookSaveTimeout =
        setTimeout(
          async () => {

            console.log(
              "Saving workbook..."
            );

            await window.electronAPI.saveWorkbookSheet(
              {

                filePath:
                  syncFilePath,

                sheetName:
                  activeSheetName,

                rowData:
                  updatedRows,

                columnDefs:
                  updatedColumns,
              }
            );

          },

          1000
        );
    };

  const onCellValueChanged =
    (
      params
    ) => {

      const updatedRows =
        rowData.map(
          (
            row
          ) => {

            if (
              row.__rowId ===
              params.data
                .__rowId
            ) {

              return {
                ...params.data,
              };
            }

            return row;
          }
        );

      setRowData(
        updatedRows
      );

      updateCurrentSheet(
        updatedRows,
        columnDefs
      );

      debouncedWorkbookSave(
        updatedRows,
        columnDefs
      );
    };

  // =========================
  // EXPORT
  // =========================

  const exportExcel =
    async () => {

      const workbook =
        new ExcelJS.Workbook();

      const worksheet =
        workbook.addWorksheet(
          activeSheetName ||
          "Sheet"
        );

      worksheet.columns =
        columnDefs.map(
          (
            col
          ) => ({

            header:
              col.field,

            key:
              col.field,

            width:
              35,
          })
        );

      rowData.forEach(
        (
          row
        ) => {

          const cleaned =
          {
            ...row,
          };

          delete cleaned.__rowId;

          worksheet.addRow(
            cleaned
          );
        }
      );

      const buffer =
        await workbook.xlsx.writeBuffer();

      const blob =
        new Blob(
          [buffer],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        URL.createObjectURL(
          blob
        );

      link.download =
        `${activeSheetName}.xlsx`;

      link.click();
    };

  // =========================
  // FILTER
  // =========================

  const filteredData =
    useMemo(() => {

      if (
        !searchText
      ) {
        return rowData;
      }

      return rowData.filter(
        (
          row
        ) =>
          Object.values(
            row
          ).some(
            (
              value
            ) =>
              String(
                value
              )
                .toLowerCase()
                .includes(
                  searchText.toLowerCase()
                )
          )
      );

    }, [
      rowData,
      searchText,
    ]);

  return (

    <div className="
      space-y-8
    ">

      <div className="
        flex
        justify-between
        items-start
        flex-wrap
        gap-6
      ">

        <div>

          <h1 className="
            text-5xl
            font-black
          ">
            Excel Workspace
          </h1>

          <p className="
            text-slate-400
            mt-2
            text-lg
          ">
            Enterprise sheet operations
          </p>

        </div>

        <label className="
          flex
          items-center
          gap-3
          bg-blue-600
          hover:bg-blue-700
          transition
          px-6
          py-4
          rounded-2xl
          cursor-pointer
          font-semibold
          shadow-2xl
        ">

          <Upload size={20} />

          Upload Excel

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={
              handleFileUpload
            }
            className="hidden"
          />

        </label>

      </div>

      <div className="
        flex
        flex-wrap
        gap-3
      ">

        {sheetsData.map(
          (
            sheet
          ) => (

            <button
              key={
                sheet.name
              }
              onClick={() =>
                setActiveSheetName(
                  sheet.name
                )
              }
              className={`
                px-5
                py-3
                rounded-2xl
                transition
                font-medium

                ${activeSheetName ===
                  sheet.name

                  ? "bg-blue-600 text-white"

                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }
              `}
            >
              {sheet.name}
            </button>
          )
        )}

      </div>

      <div className="
        flex
        justify-between
        items-center
        gap-4
        flex-wrap
      ">

        <div className="
          flex
          items-center
          gap-3
          bg-white/5
          border
          border-white/10
          rounded-2xl
          px-5
          py-4
          w-[420px]
        ">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search sheet data..."
            value={
              searchText
            }
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
            className="
              bg-transparent
              outline-none
              text-white
              w-full
            "
          />

        </div>

        <SheetToolbar
          addRow={addRow}
          deleteRows={
            deleteRows
          }
          addColumn={
            addColumn
          }
          deleteColumn={
            deleteColumn
          }
          exportExcel={
            exportExcel
          }
          selectedCount={
            selectedRows.length
          }
        />

      </div>

      <SheetGrid
        rowData={
          filteredData
        }
        columnDefs={
          columnDefs
        }
        renameColumn={
          renameColumn
        }
        setSelectedRows={
          setSelectedRows
        }
        onCellValueChanged={
          onCellValueChanged
        }

        onRowClicked={(
          event
        ) => {

          navigate(

            `/laptops/${encodeURIComponent(

              event.data[
              "SUDA Asset Tag"
              ] ||

              event.data[
              "Asset Tag"
              ] ||

              event.data[
              "__rowId"
              ]
            )}`,

            {
              state: {

                laptop:
                  event.data,

                sheetName:
                  activeSheetName,
              },
            }
          );
        }}
      />

      <InputModal
        open={modalOpen}
        title={
          modalType === "rename"

            ? "Rename Column"

            : modalType === "delete"

              ? "Delete Column"

              : "Add Column"
        }
        placeholder="Enter value..."
        defaultValue={
          modalValue
        }
        confirmText="Confirm"
        onClose={() =>
          setModalOpen(false)
        }
        onConfirm={
          handleModalConfirm
        }
      />

    </div>
  );
}