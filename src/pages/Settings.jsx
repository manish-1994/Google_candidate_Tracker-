import {
  useEffect,
  useState,
} from "react";

export default function Settings() {

  const [
    syncPath,
    setSyncPath,
  ] = useState(
    localStorage.getItem(
      "syncFilePath"
    ) || ""
  );

  const [
    syncEnabled,
    setSyncEnabled,
  ] = useState(false);

  // =========================
  // RESET SHEETS
  // =========================

  const resetSheetsData =
    () => {

      const confirmed =
        window.confirm(
          "Are you sure you want to reset all uploaded sheets and laptop inventory?"
        );

      if (!confirmed)
        return;

      localStorage.removeItem(
        "sheetsData"
      );

      localStorage.removeItem(
        "activeSheetName"
      );

      localStorage.removeItem(
        "laptops"
      );

      window.location.reload();
    };

  // =========================
  // RESET CANDIDATES
  // =========================

  const resetCandidatesData =
    () => {

      const confirmed =
        window.confirm(
          "Are you sure you want to reset all candidate CRM data?"
        );

      if (!confirmed)
        return;

      localStorage.removeItem(
        "candidates"
      );

      localStorage.removeItem(
        "candidateColumns"
      );

      localStorage.removeItem(
        "candidateCardSettings"
      );

      window.location.reload();
    };

  // =========================
  // START WATCHER
  // =========================

  const startSync =
    async () => {

      if (
        !window.electronAPI
      ) {

        alert(
          "Electron API unavailable"
        );

        return;
      }

      if (!syncPath) {

        alert(
          "Enter workbook path"
        );

        return;
      }

      try {

        await window.electronAPI.startExcelWatch(
          syncPath
        );

        localStorage.setItem(
          "syncFilePath",
          syncPath
        );

        setSyncEnabled(
          true
        );

        alert(
          "Workbook sync started"
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Failed to start sync"
        );
      }
    };

  useEffect(() => {

    const existing =
      localStorage.getItem(
        "syncFilePath"
      );

    if (
      existing
    ) {

      setSyncEnabled(
        true
      );
    }

  }, []);

  return (

    <div className="
      space-y-8
      pb-10
    ">

      {/* HEADER */}

      <div>

        <h1 className="
          text-5xl
          font-black
        ">
          Settings
        </h1>

        <p className="
          text-slate-400
          mt-2
        ">
          Manage application preferences
        </p>

      </div>

      {/* ONEDRIVE SYNC */}

      <div className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        backdrop-blur-xl
        space-y-6
      ">

        <div>

          <h2 className="
            text-2xl
            font-bold
          ">
            OneDrive Workbook Sync
          </h2>

          <p className="
            text-slate-400
            mt-2
          ">
            Automatically sync your local OneDrive Excel workbook with the platform
          </p>

        </div>

        <div className="
          space-y-4
        ">

          <input
            type="text"
            value={syncPath}
            onChange={(e) =>
              setSyncPath(
                e.target.value
              )
            }
            placeholder="C:\Users\manish\OneDrive\New Laptop Tracker.xlsx"
            className="
              w-full
              bg-slate-900/70
              border
              border-white/10
              rounded-2xl
              px-5
              py-4
              outline-none
              text-white
            "
          />

          <div className="
            flex
            items-center
            gap-4
            flex-wrap
          ">

            <button
              onClick={
                startSync
              }
              className="
                bg-blue-600
                hover:bg-blue-700
                transition
                px-5
                py-3
                rounded-2xl
                font-semibold
              "
            >
              Start Sync
            </button>

            <div className={`
              px-4
              py-2
              rounded-2xl
              text-sm
              font-semibold
              ${
                syncEnabled

                  ? "bg-green-600"

                  : "bg-slate-700"
              }
            `}>

              {
                syncEnabled

                  ? "Sync Active"

                  : "Sync Disabled"
              }

            </div>

          </div>

        </div>

      </div>

      {/* RESET SHEETS */}

      <div className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        backdrop-blur-xl
        space-y-6
      ">

        <div className="
          flex
          justify-between
          items-center
          flex-wrap
          gap-4
        ">

          <div>

            <h2 className="
              text-2xl
              font-bold
            ">
              Reset Sheets & Inventory
            </h2>

            <p className="
              text-slate-400
              mt-2
            ">
              Clears uploaded Excel sheets, laptop inventory and workbook data
            </p>

          </div>

          <button
            onClick={
              resetSheetsData
            }
            className="
              bg-red-600
              hover:bg-red-700
              transition
              px-5
              py-3
              rounded-2xl
              font-semibold
            "
          >
            Reset Sheets
          </button>

        </div>

      </div>

      {/* RESET CANDIDATES */}

      <div className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        backdrop-blur-xl
        space-y-6
      ">

        <div className="
          flex
          justify-between
          items-center
          flex-wrap
          gap-4
        ">

          <div>

            <h2 className="
              text-2xl
              font-bold
            ">
              Reset Candidates CRM
            </h2>

            <p className="
              text-slate-400
              mt-2
            ">
              Clears candidates, layouts, custom fields and CRM settings
            </p>

          </div>

          <button
            onClick={
              resetCandidatesData
            }
            className="
              bg-orange-600
              hover:bg-orange-700
              transition
              px-5
              py-3
              rounded-2xl
              font-semibold
            "
          >
            Reset Candidates
          </button>

        </div>

      </div>

    </div>
  );
}