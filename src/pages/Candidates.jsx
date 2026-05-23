import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  Search,
  User,
  Laptop,
  Mail,
  Calendar,
  Save,
  Briefcase,
  X,
  Download,
  ChevronUp,
  ChevronDown,
  Settings2,
} from "lucide-react";

import ExcelJS from "exceljs";

import {
  useApp,
} from "../context/AppContext";

export default function Candidates() {

  const {

    candidates,

    candidateColumns,

    availableLaptops,

    addCandidate,

    updateCandidate,

    deleteCandidate,

    addCandidateColumn,

    assignLaptop,

    setCandidateColumns,

    moveFieldUp,

    moveFieldDown,

    candidateCardSettings,

    updateCardSettings,

  } = useApp();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedCandidateId,
    setSelectedCandidateId,
  ] = useState(null);

  const [
    showSettings,
    setShowSettings,
  ] = useState(false);

  // FILTERED

  const filteredCandidates =
    useMemo(() => {

      return candidates.filter(
        (candidate) =>

          Object.values(
            candidate
          ).some((value) =>

            String(value)
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )
      );

    }, [
      candidates,
      search,
    ]);

  // SELECTED

  const selectedCandidate =
    candidates.find(
      (c) =>
        c.id ===
        selectedCandidateId
    );

  // ADD FIELD

  const handleAddColumn =
    () => {

      const name =
        prompt(
          "Field Name"
        );

      if (!name)
        return;

      const type =
        prompt(
          "Type: text / checkbox / date / textarea"
        );

      if (!type)
        return;

      addCandidateColumn(
        name,
        type
      );
    };

  // DELETE FIELD

  const handleDeleteField =
    (columnId) => {

      const confirmed =
        confirm(
          "Delete this field?"
        );

      if (!confirmed)
        return;

      const updated =
        candidateColumns.filter(
          (col) =>
            col.id !==
            columnId
        );

      setCandidateColumns(
        updated
      );
    };

  // EXPORT

  const exportCandidates =
    async () => {

      const workbook =
        new ExcelJS.Workbook();

      const worksheet =
        workbook.addWorksheet(
          "Candidates"
        );

      const headers = [

        ...candidateColumns.map(
          (col) =>
            col.name
        ),

        "Assigned Laptop",

      ];

      worksheet.addRow(
        headers
      );

      worksheet.getRow(1).font = {

        bold: true,

        color: {
          argb: "FFFFFF",
        },

      };

      worksheet.getRow(1).fill = {

        type: "pattern",

        pattern: "solid",

        fgColor: {
          argb: "2563EB",
        },

      };

      worksheet.columns.forEach(
        (column) => {

          column.width = 28;

        }
      );

      candidates.forEach(
        (candidate) => {

          const row = [

            ...candidateColumns.map(
              (col) => {

                const value =
                  candidate[
                    col.name
                  ];

                if (
                  typeof value ===
                  "boolean"
                ) {

                  return value
                    ? "Yes"
                    : "No";
                }

                return (
                  value || ""
                );
              }
            ),

            candidate.assignedLaptopId ||
              "",

          ];

          worksheet.addRow(
            row
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

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "Candidates.xlsx";

      link.click();

      window.URL.revokeObjectURL(
        url
      );
    };

  // FIELD RENDER

  const renderField =
    (
      candidate,
      column
    ) => {

      switch (
        column.type
      ) {

        case "checkbox":

          return (

            <input
              type="checkbox"
              checked={
                candidate[
                  column.name
                ] || false
              }
              onChange={(e) =>
                updateCandidate(
                  candidate.id,
                  column.name,
                  e.target
                    .checked
                )
              }
              className="
                w-6
                h-6
                accent-blue-600
              "
            />
          );

        case "date":

          return (

            <input
              type="date"
              value={
                candidate[
                  column.name
                ] || ""
              }
              onChange={(e) =>
                updateCandidate(
                  candidate.id,
                  column.name,
                  e.target
                    .value
                )
              }
              className="
                bg-slate-800
                border
                border-white/10
                rounded-2xl
                px-4
                py-4
                text-white
                w-full
                outline-none
              "
            />
          );

        case "textarea":

          return (

            <textarea
              value={
                candidate[
                  column.name
                ] || ""
              }
              onChange={(e) =>
                updateCandidate(
                  candidate.id,
                  column.name,
                  e.target
                    .value
                )
              }
              className="
                bg-slate-800
                border
                border-white/10
                rounded-2xl
                px-4
                py-4
                text-white
                w-full
                min-h-[140px]
                resize-none
                outline-none
              "
            />
          );

        default:

          return (

            <input
              type="text"
              value={
                candidate[
                  column.name
                ] || ""
              }
              onChange={(e) =>
                updateCandidate(
                  candidate.id,
                  column.name,
                  e.target
                    .value
                )
              }
              className="
                bg-slate-800
                border
                border-white/10
                rounded-2xl
                px-4
                py-4
                text-white
                w-full
                outline-none
              "
            />
          );
      }
    };

  return (

    <div className="
      h-full
      flex
      gap-6
      overflow-hidden
    ">

      {/* LEFT */}

      <div className="
        w-[420px]
        min-w-[420px]
        flex
        flex-col
        gap-5
      ">

        {/* TOP */}

        <div className="
          flex
          justify-between
          items-start
        ">

          <div>

            <h1 className="
              text-5xl
              font-black
            ">
              Candidates
            </h1>

            <p className="
              text-slate-400
              mt-2
            ">
              Custom CRM Workspace
            </p>

          </div>

          <button
            onClick={
              addCandidate
            }
            className="
              bg-blue-600
              hover:bg-blue-700
              transition
              w-16
              h-16
              rounded-3xl
              flex
              items-center
              justify-center
            "
          >

            <Plus size={28} />

          </button>

        </div>

        {/* SEARCH */}

        <div className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          px-5
          py-4
          flex
          items-center
          gap-3
        ">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(
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

        {/* BUTTONS */}

        <div className="
          grid
          grid-cols-3
          gap-4
        ">

          <button
            onClick={
              handleAddColumn
            }
            className="
              bg-purple-600
              hover:bg-purple-700
              transition
              py-4
              rounded-3xl
              font-bold
            "
          >
            Add Field
          </button>

          <button
            onClick={
              exportCandidates
            }
            className="
              bg-green-600
              hover:bg-green-700
              transition
              py-4
              rounded-3xl
              font-bold
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <Download size={18} />

            Export

          </button>

          <button
            onClick={() =>
              setShowSettings(
                !showSettings
              )
            }
            className="
              bg-slate-700
              hover:bg-slate-600
              transition
              py-4
              rounded-3xl
              font-bold
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <Settings2 size={18} />

            Layout

          </button>

        </div>

        {/* SETTINGS */}

        {showSettings && (

          <div className="
            bg-slate-900/80
            border
            border-white/10
            rounded-[32px]
            p-6
            space-y-5
          ">

            <h2 className="
              text-2xl
              font-black
            ">
              Card Settings
            </h2>

            <div>

              <p className="
                text-sm
                text-slate-400
                mb-2
              ">
                Card Title
              </p>

              <select
                value={
                  candidateCardSettings.titleField
                }
                onChange={(e) =>
                  updateCardSettings(
                    "titleField",
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-slate-800
                  border
                  border-white/10
                  rounded-2xl
                  px-4
                  py-4
                  text-white
                "
              >

                {candidateColumns.map(
                  (column) => (

                    <option
                      key={
                        column.id
                      }
                      value={
                        column.name
                      }
                    >

                      {
                        column.name
                      }

                    </option>

                  )
                )}

              </select>

            </div>

            <div>

              <p className="
                text-sm
                text-slate-400
                mb-2
              ">
                Card Subtitle
              </p>

              <select
                value={
                  candidateCardSettings.subtitleField
                }
                onChange={(e) =>
                  updateCardSettings(
                    "subtitleField",
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-slate-800
                  border
                  border-white/10
                  rounded-2xl
                  px-4
                  py-4
                  text-white
                "
              >

                {candidateColumns.map(
                  (column) => (

                    <option
                      key={
                        column.id
                      }
                      value={
                        column.name
                      }
                    >

                      {
                        column.name
                      }

                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        )}

        {/* CARDS */}

        <div className="
          flex-1
          overflow-auto
          space-y-4
          pr-2
        ">

          {filteredCandidates.map(
            (
              candidate
            ) => (

              <div
                key={
                  candidate.id
                }
                onClick={() =>
                  setSelectedCandidateId(
                    candidate.id
                  )
                }
                className={`
                  border
                  rounded-[30px]
                  p-5
                  cursor-pointer
                  transition
                  ${
                    selectedCandidateId ===
                    candidate.id

                      ? "bg-blue-600/10 border-blue-500"

                      : "bg-white/5 border-white/10"
                  }
                `}
              >

                <div className="
                  flex
                  justify-between
                  items-start
                ">

                  <div className="
                    flex
                    gap-4
                  ">

                    <div className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-blue-600
                      flex
                      items-center
                      justify-center
                    ">

                      <User />

                    </div>

                    <div>

                      <h2 className="
                        text-lg
                        font-bold
                      ">

                        {
                          candidate[
                            candidateCardSettings.titleField
                          ] ||

                          "Untitled"
                        }

                      </h2>

                      <p className="
                        text-slate-400
                        text-sm
                        mt-1
                      ">

                        {
                          candidate[
                            candidateCardSettings.subtitleField
                          ] ||

                          "No Value"
                        }

                      </p>

                    </div>

                  </div>

                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      deleteCandidate(
                        candidate.id
                      );
                    }}
                    className="
                      bg-red-600
                      hover:bg-red-700
                      transition
                      p-2
                      rounded-xl
                    "
                  >

                    <Trash2
                      size={15}
                    />

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

      {/* RIGHT */}

      <div className="
        flex-1
        bg-white/5
        border
        border-white/10
        rounded-[36px]
        overflow-auto
      ">

        {!selectedCandidate ? (

          <div className="
            h-full
            flex
            items-center
            justify-center
          ">

            <div className="
              text-center
            ">

              <User
                size={80}
                className="
                  text-slate-700
                  mx-auto
                "
              />

              <h2 className="
                text-4xl
                font-black
                mt-6
              ">
                Select Candidate
              </h2>

            </div>

          </div>

        ) : (

          <div className="
            p-8
            space-y-6
          ">

            <div className="
              flex
              justify-between
              items-center
            ">

              <h1 className="
                text-5xl
                font-black
              ">

                {
                  selectedCandidate[
                    candidateCardSettings.titleField
                  ] || "Untitled"
                }

              </h1>

              <div className="
                bg-green-600
                px-5
                py-3
                rounded-2xl
                font-bold
                flex
                items-center
                gap-2
              ">

                <Save size={18} />

                Auto Saved

              </div>

            </div>

            {/* LAPTOP */}

            <div className="
              bg-slate-900/60
              border
              border-white/10
              rounded-[32px]
              p-7
            ">

              <div className="
                flex
                items-center
                gap-3
                mb-5
              ">

                <Laptop />

                <h2 className="
                  text-3xl
                  font-black
                ">
                  Assigned Laptop
                </h2>

              </div>

              <select
                value={
                  selectedCandidate.assignedLaptopId ||
                  ""
                }
                onChange={(e) =>
                  assignLaptop(
                    selectedCandidate.id,
                    e.target.value
                  )
                }
                className="
                  bg-slate-800
                  border
                  border-white/10
                  rounded-2xl
                  px-5
                  py-5
                  text-white
                  w-full
                  outline-none
                "
              >

                <option value="">
                  Select Laptop
                </option>

                {availableLaptops.map(
                  (
                    laptop,
                    index
                  ) => (

                    <option
                      key={index}
                      value={
                        laptop[
                          "Akraya Asset ID"
                        ]
                      }
                    >

                      {
                        laptop[
                          "Akraya Asset ID"
                        ]
                      }

                    </option>

                  )
                )}

              </select>

            </div>

            {/* FIELDS */}

            <div className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-6
            ">

              {candidateColumns.map(
                (
                  column
                ) => (

                  <div
                    key={
                      column.id
                    }
                    className="
                      bg-slate-900/60
                      border
                      border-white/10
                      rounded-[30px]
                      p-6
                      relative
                    "
                  >

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDeleteField(
                          column.id
                        )
                      }
                      className="
                        absolute
                        top-4
                        right-4
                        bg-red-600
                        hover:bg-red-700
                        transition
                        w-8
                        h-8
                        rounded-xl
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <X size={14} />

                    </button>

                    {/* MOVE */}

                    <div className="
                      absolute
                      top-4
                      right-14
                      flex
                      gap-2
                    ">

                      <button
                        onClick={() =>
                          moveFieldUp(
                            column.id
                          )
                        }
                        className="
                          bg-slate-700
                          hover:bg-slate-600
                          transition
                          w-8
                          h-8
                          rounded-xl
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <ChevronUp
                          size={14}
                        />

                      </button>

                      <button
                        onClick={() =>
                          moveFieldDown(
                            column.id
                          )
                        }
                        className="
                          bg-slate-700
                          hover:bg-slate-600
                          transition
                          w-8
                          h-8
                          rounded-xl
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <ChevronDown
                          size={14}
                        />

                      </button>

                    </div>

                    <div className="
                      flex
                      items-center
                      gap-3
                      mb-5
                    ">

                      <h3 className="
                        text-xl
                        font-bold
                      ">

                        {
                          column.name
                        }

                      </h3>

                    </div>

                    {renderField(
                      selectedCandidate,
                      column
                    )}

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}