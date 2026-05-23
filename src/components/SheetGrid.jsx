import {
  AgGridReact,
} from "ag-grid-react";

import {
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";

import {
  useMemo,
} from "react";

import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([
  AllCommunityModule,
]);

export default function SheetGrid({
  rowData = [],
  columnDefs = [],
  renameColumn,
  onCellValueChanged,
  setSelectedRows,
}) {
  const safeColumnDefs =
    useMemo(() => {
      if (
        !Array.isArray(
          columnDefs
        )
      ) {
        return [];
      }

      return columnDefs
        .filter(
          (col) =>
            col &&
            typeof col ===
              "object" &&
            col.field &&
            col.field !==
              "__rowId"
        )
        .map((col) => ({
          ...col,

          editable: true,

          sortable: true,

          filter: true,

          floatingFilter: true,

          resizable: true,

          minWidth: 220,

          width: 280,

          // CRITICAL FIX
          valueGetter:
            (params) => {
              return (
                params.data?.[
                  col.field
                ] ?? ""
              );
            },

          valueSetter:
            (params) => {
              params.data[
                col.field
              ] = params.newValue;

              return true;
            },

          valueFormatter:
            (params) => {
              if (
                typeof params.value ===
                "object"
              ) {
                try {
                  return JSON.stringify(
                    params.value
                  );
                } catch {
                  return String(
                    params.value
                  );
                }
              }

              return (
                params.value ??
                ""
              );
            },

          headerComponent:
            (params) => {
              const field =
                params.column
                  ?.colDef
                  ?.field || "";

              return (
                <div
                  onDoubleClick={() =>
                    renameColumn(
                      field
                    )
                  }
                  className="
                    flex
                    items-center
                    h-full
                    text-white
                    font-semibold
                    cursor-pointer
                    px-2
                  "
                  title="Double click to rename"
                >
                  {field}
                </div>
              );
            },
        }));
    }, [
      columnDefs,
      renameColumn,
    ]);

  return (
    <div
      className="
        w-full
        rounded-3xl
        border
        border-white/10
        shadow-2xl
        bg-slate-900/40
        backdrop-blur-xl
        overflow-hidden
      "
    >
      <div
        className="
          ag-theme-quartz-dark
        "
        style={{
          height: "720px",
          width: "100%",
        }}
      >
        <AgGridReact
          rowData={rowData}

          columnDefs={
            safeColumnDefs
          }

          getRowId={(
            params
          ) =>
            params.data
              ?.__rowId ||
            Math.random().toString()
          }

          // IMPORTANT
          suppressFieldDotNotation={
            true
          }

          rowSelection={{
            mode: "multiRow",
            checkboxes: true,
            headerCheckbox: true,
          }}

          suppressRowClickSelection={
            false
          }

          maintainColumnOrder={
            true
          }

          animateRows={true}

          pagination={true}

          paginationPageSize={25}

          paginationPageSizeSelector={[
            25,
            50,
            100,
          ]}

          rowHeight={54}

          headerHeight={56}

          defaultColDef={{
            editable: true,

            sortable: true,

            filter: true,

            floatingFilter: true,

            resizable: true,
          }}

          onCellValueChanged={
            onCellValueChanged
          }

          onSelectionChanged={(
            event
          ) => {
            const selected =
              event.api.getSelectedRows();

            setSelectedRows(
              selected
            );
          }}
        />
      </div>
    </div>
  );
}