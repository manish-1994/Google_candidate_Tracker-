export default function Settings() {

  // RESET SHEETS ONLY
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

  // RESET CANDIDATES ONLY
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

  return (

    <div className="
      space-y-8
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

      {/* SHEETS RESET */}

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

      {/* CANDIDATES RESET */}

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