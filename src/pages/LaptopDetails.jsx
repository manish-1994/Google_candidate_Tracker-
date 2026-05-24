import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Save,
} from "lucide-react";

import {
  useApp,
} from "../context/AppContext";

export default function LaptopDetails() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const { assetTag } =
    useParams();

  const {

    sheetsData,
    setSheetsData,

  } = useApp();

  const laptop =
    location.state?.laptop;

  const sheetName =
    location.state?.sheetName;

  const [
    formData,
    setFormData,
  ] = useState({});

  const [
    saving,
    setSaving,
  ] = useState(false);

  const syncFilePath =
    localStorage.getItem(
      "syncFilePath"
    );

  // =========================
  // INITIALIZE FORM
  // =========================

  useEffect(() => {

    if (
      laptop
    ) {

      setFormData(
        laptop
      );
    }

  }, [
    laptop,
  ]);

  // =========================
  // SAVE RECORD
  // =========================

  const saveRecord =
    async () => {

      try {

        setSaving(
          true
        );

        // =========================
        // UPDATE SHEET DATA
        // =========================

        const updatedSheets =
          sheetsData.map(
            (
              sheet
            ) => {

              if (
                sheet.name !==
                sheetName
              ) {

                return sheet;
              }

              const updatedRows =
                sheet.rowData.map(
                  (
                    row
                  ) => {

                    if (

                      row[
                        "SUDA Asset Tag"
                      ] ===

                      laptop[
                        "SUDA Asset Tag"
                      ]

                    ) {

                      return {
                        ...formData,
                      };
                    }

                    return row;
                  }
                );

              // =========================
              // SAVE TO WORKBOOK
              // =========================

              window.electronAPI
                ?.saveWorkbookSheet({

                  filePath:
                    syncFilePath,

                  sheetName:
                    sheet.name,

                  rowData:
                    updatedRows,

                  columnDefs:
                    sheet.columnDefs,
                });

              return {

                ...sheet,

                rowData:
                  updatedRows,
              };
            }
          );

        setSheetsData(
          updatedSheets
        );

        setTimeout(
          () => {

            setSaving(
              false
            );
          },

          800
        );

      } catch (
        error
      ) {

        console.error(
          error
        );

        setSaving(
          false
        );
      }
    };

  // =========================
  // NOT FOUND
  // =========================

  if (!laptop) {

    return (

      <div className="
        p-10
        text-white
      ">

        Record not found.

      </div>
    );
  }

  return (

    <div className="
      p-8
      space-y-8
      text-white
    ">

      {/* HEADER */}

      <div className="
        flex
        justify-between
        items-center
        flex-wrap
        gap-4
      ">

        <div>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              px-5
              py-3
              rounded-2xl
              bg-slate-800
              hover:bg-slate-700
              transition
              mb-5
            "
          >
            ← Back
          </button>

          <h1 className="
            text-5xl
            font-black
          ">
            Laptop Details
          </h1>

          <p className="
            text-slate-400
            mt-2
            text-lg
          ">
            {assetTag}
          </p>

        </div>

        {/* SAVE */}

        <button
          onClick={
            saveRecord
          }
          className="
            flex
            items-center
            gap-3
            px-6
            py-4
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            transition
            font-semibold
            shadow-2xl
          "
        >

          <Save size={20} />

          {
            saving

              ? "Saving..."

              : "Save Record"
          }

        </button>

      </div>

      {/* FORM */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {Object.entries(
          formData
        ).map(
          ([
            key,
            value,
          ]) => (

            <div
              key={key}
              className="
                bg-slate-900/60
                border
                border-white/10
                rounded-3xl
                p-5
                backdrop-blur-xl
              "
            >

              <p className="
                text-slate-400
                text-sm
                mb-3
              ">
                {key}
              </p>

              <input
                value={
                  value || ""
                }
                onChange={(
                  e
                ) =>

                  setFormData({

                    ...formData,

                    [key]:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  bg-slate-800
                  border
                  border-white/10
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-500
                "
              />

            </div>
          )
        )}

      </div>

    </div>
  );
}