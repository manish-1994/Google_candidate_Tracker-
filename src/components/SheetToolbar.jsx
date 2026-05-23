import {
  Plus,
  Trash2,
  Columns3,
  Download,
} from "lucide-react";

export default function SheetToolbar({
  addRow,
  deleteRows,
  addColumn,
  deleteColumn,
  exportExcel,
  selectedCount,
}) {
  return (
    <div className="
      flex
      flex-wrap
      gap-3
    ">
      <button
        onClick={addRow}
        className="
          flex
          items-center
          gap-2
          bg-blue-600
          hover:bg-blue-700
          transition
          px-5
          py-4
          rounded-2xl
          font-semibold
        "
      >
        <Plus size={18} />
        Add Row
      </button>

      <button
        onClick={deleteRows}
        disabled={!selectedCount}
        className="
          flex
          items-center
          gap-2
          bg-red-600
          hover:bg-red-700
          transition
          px-5
          py-4
          rounded-2xl
          font-semibold
          disabled:opacity-40
        "
      >
        <Trash2 size={18} />

        Delete Rows

        {selectedCount > 0 &&
          ` (${selectedCount})`}
      </button>

      <button
        onClick={addColumn}
        className="
          flex
          items-center
          gap-2
          bg-purple-600
          hover:bg-purple-700
          transition
          px-5
          py-4
          rounded-2xl
          font-semibold
        "
      >
        <Columns3 size={18} />
        Add Column
      </button>

      <button
        onClick={deleteColumn}
        className="
          flex
          items-center
          gap-2
          bg-orange-600
          hover:bg-orange-700
          transition
          px-5
          py-4
          rounded-2xl
          font-semibold
        "
      >
        <Trash2 size={18} />
        Delete Column
      </button>

      <button
        onClick={exportExcel}
        className="
          flex
          items-center
          gap-2
          bg-green-600
          hover:bg-green-700
          transition
          px-5
          py-4
          rounded-2xl
          font-semibold
        "
      >
        <Download size={18} />
        Export
      </button>
    </div>
  );
}