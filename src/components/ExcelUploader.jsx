import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ExcelJS from "exceljs";

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

  useEffect(() => {
    if (!activeSheetName)
      return;

    const currentSheet =
      sheetsData.find(
        (sheet) =>
          sheet.name ===
          activeSheetName
      );

    if (!currentSheet)
      return;

    setRowData(
      currentSheet.rowData || []
    );

    setColumnDefs(
      currentSheet.columnDefs || []
    );
  }, [
    activeSheetName,
    sheetsData,
  ]);

  const updateCurrentSheet = (
    updatedRows,
    updatedColumns
  ) => {
    const updatedSheets =
      sheetsData.map((sheet) => {
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
      });

    setSheetsData(
      updatedSheets
    );
  };

  const handleFileUpload =
    async (event) => {
      const file =
        event.target.files[0];

      if (!file) return;

      const workbook =
        new ExcelJS.Workbook();

      const arrayBuffer =
        await file.arrayBuffer();

      await workbook.xlsx.load(
        arrayBuffer
      );

      const parsedLaptops =
        parseLaptopSheets(
          workbook
        );

      setLaptops(
        parsedLaptops
      );

      const parsedSheets =
        workbook.worksheets.map(
          (worksheet) => {
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
          parsedSheets[0].name
        );
      }
    };

  const addRow = () => {
    const newRow = {
      __rowId:
        crypto.randomUUID?.() ||
        `${Date.now()}`,
    };

    columnDefs.forEach(
      (col) => {
        newRow[col.field] =
          "";
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

  // FIXED DELETE ROWS
  const deleteRows = () => {
    if (
      !selectedRows.length
    ) {
      return;
    }

    const selectedIds =
      selectedRows.map(
        (row) =>
          row.__rowId
      );

    const updatedRows =
      rowData.filter(
        (row) =>
          !selectedIds.includes(
            row.__rowId
          )
      );

    setSelectedRows([]);

    setRowData(
      updatedRows
    );

    updateCurrentSheet(
      updatedRows,
      columnDefs
    );
  };

  const addColumn = () => {
    const columnName =
      prompt(
        "Column name"
      );

    if (!columnName)
      return;

    const trimmedName =
      columnName.trim();

    const exists =
      columnDefs.find(
        (col) =>
          col.field.toLowerCase() ===
          trimmedName.toLowerCase()
      );

    if (exists) {
      alert(
        "Column already exists"
      );

      return;
    }

    const newColumn = {
      field: trimmedName,

      headerName:
        trimmedName,

      editable: true,

      sortable: true,

      filter: true,

      floatingFilter: true,

      resizable: true,

      minWidth: 220,

      width: 280,
    };

    const updatedColumns = [
      ...columnDefs,
      newColumn,
    ];

    const updatedRows =
      rowData.map((row) => ({
        ...row,
        [trimmedName]: "",
      }));

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
  };

  const deleteColumn =
    () => {
      const columnName =
        prompt(
          "Enter exact column name"
        );

      if (!columnName)
        return;

      const updatedColumns =
        columnDefs.filter(
          (col) =>
            col.field !==
            columnName
        );

      const updatedRows =
        rowData.map(
          (row) => {
            const updated =
              {
                ...row,
              };

            delete updated[
              columnName
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
    };

  const renameColumn = (
    oldField
  ) => {
    const newField =
      prompt(
        "Rename column",
        oldField
      );

    if (
      !newField ||
      newField === oldField
    ) {
      return;
    }

    const trimmedName =
      newField.trim();

    const exists =
      columnDefs.find(
        (col) =>
          col.field ===
          trimmedName
      );

    if (exists) {
      alert(
        "Column already exists"
      );

      return;
    }

    const updatedColumns =
      columnDefs.map(
        (col) => {
          if (
            col.field ===
            oldField
          ) {
            return {
              ...col,

              field:
                trimmedName,

              headerName:
                trimmedName,
            };
          }

          return col;
        }
      );

    const updatedRows =
      rowData.map(
        (row) => {
          const updated =
            {
              ...row,
            };

          updated[
            trimmedName
          ] =
            updated[
              oldField
            ];

          delete updated[
            oldField
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
  };

  // FIXED CELL UPDATE
  const onCellValueChanged =
    (params) => {
      const updatedRows =
        rowData.map((row) => {
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
        });

      setRowData(
        updatedRows
      );

      updateCurrentSheet(
        updatedRows,
        columnDefs
      );
    };

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
          (col) => ({
            header:
              col.field,

            key:
              col.field,

            width: 35,
          })
        );

      rowData.forEach(
        (row) => {
          const cleaned =
            { ...row };

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

  // FIXED FILTERING
  const filteredData =
    useMemo(() => {
      if (!searchText)
        return rowData;

      return rowData.filter(
        (row) =>
          Object.values(
            row
          ).some((value) =>
            String(value)
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
    <div className="space-y-8">
      <div className="flex justify-between items-start flex-wrap gap-6">
        <div>
          <h1 className="text-5xl font-black">
            Excel Workspace
          </h1>

          <p className="text-slate-400 mt-2 text-lg">
            Enterprise sheet operations
          </p>
        </div>

        <label className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition px-6 py-4 rounded-2xl cursor-pointer font-semibold shadow-2xl">
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

      <div className="flex flex-wrap gap-3">
        {sheetsData.map(
          (sheet) => (
            <button
              key={sheet.name}
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
                ${
                  activeSheetName ===
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

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 w-[420px]">
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
            className="bg-transparent outline-none text-white w-full"
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
      />
    </div>
  );
}