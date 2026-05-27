import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  ShieldAlert,
  Laptop,
  Clock3,
  Save,
} from "lucide-react";

export default function Settings() {

  // =========================
  // SYNC
  // =========================

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
  // ALERT SETTINGS
  // =========================

  const [
    alertSettings,
    setAlertSettings,
  ] = useState(() => {

    const saved =
      localStorage.getItem(
        "alertSettings"
      );

    if (saved) {

      return JSON.parse(
        saved
      );
    }

    return {

      desktopNotifications:
        true,

      pendingOnboarding:
        true,

      noLaptopAssigned:
        true,

      usThreshold:
        20,

      indiaThreshold:
        5,

      workbookReminderHours:
        1,

      damagedInventoryAlerts:
        true,

    };
  });

  // =========================
  // SAVE SETTINGS
  // =========================

  const saveAlertSettings =
    () => {

      localStorage.setItem(
        "alertSettings",
        JSON.stringify(
          alertSettings
        )
      );

      alert(
        "Alert settings saved"
      );
    };

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

  const startSync = async () => {

    if (!syncPath) {

      alert(
        "Enter workbook path"
      );

      return;
    }

    localStorage.setItem(
      "syncFilePath",
      syncPath
    );

    setSyncEnabled(
      true
    );

    alert(
      "Workbook path saved successfully."
    );
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
          Manage operational preferences
        </p>

      </div>

      {/* ALERT SETTINGS */}

      <div className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        backdrop-blur-xl
        space-y-8
      ">

        <div className="
          flex
          items-center
          gap-4
        ">

          <div className="
            w-14
            h-14
            rounded-2xl
            bg-red-500
            flex
            items-center
            justify-center
          ">

            <Bell size={24} />

          </div>

          <div>

            <h2 className="
              text-3xl
              font-black
            ">
              Alert Management
            </h2>

            <p className="
              text-slate-400
              mt-1
            ">
              Configure operational alerts & reminders
            </p>

          </div>

        </div>

        {/* TOGGLES */}

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-5
        ">

          {/* DESKTOP */}

          <div className="
            bg-slate-900/70
            border
            border-white/10
            rounded-3xl
            p-5
            flex
            justify-between
            items-center
          ">

            <div>

              <h3 className="
                text-xl
                font-bold
              ">
                Desktop Notifications
              </h3>

              <p className="
                text-slate-400
                mt-2
                text-sm
              ">
                Show operational desktop alerts
              </p>

            </div>

            <input
              type="checkbox"
              checked={
                alertSettings.desktopNotifications
              }
              onChange={(e) =>
                setAlertSettings({
                  ...alertSettings,
                  desktopNotifications:
                    e.target.checked,
                })
              }
              className="
                w-6
                h-6
              "
            />

          </div>

          {/* ONBOARDING */}

          <div className="
            bg-slate-900/70
            border
            border-white/10
            rounded-3xl
            p-5
            flex
            justify-between
            items-center
          ">

            <div>

              <h3 className="
                text-xl
                font-bold
              ">
                Pending Onboarding
              </h3>

              <p className="
                text-slate-400
                mt-2
                text-sm
              ">
                Alert when onboarding exceeds threshold
              </p>

            </div>

            <input
              type="checkbox"
              checked={
                alertSettings.pendingOnboarding
              }
              onChange={(e) =>
                setAlertSettings({
                  ...alertSettings,
                  pendingOnboarding:
                    e.target.checked,
                })
              }
              className="
                w-6
                h-6
              "
            />

          </div>

          {/* NO LAPTOP */}

          <div className="
            bg-slate-900/70
            border
            border-white/10
            rounded-3xl
            p-5
            flex
            justify-between
            items-center
          ">

            <div>

              <h3 className="
                text-xl
                font-bold
              ">
                No Laptop Assigned
              </h3>

              <p className="
                text-slate-400
                mt-2
                text-sm
              ">
                Alert when candidates have no assigned laptop
              </p>

            </div>

            <input
              type="checkbox"
              checked={
                alertSettings.noLaptopAssigned
              }
              onChange={(e) =>
                setAlertSettings({
                  ...alertSettings,
                  noLaptopAssigned:
                    e.target.checked,
                })
              }
              className="
                w-6
                h-6
              "
            />

          </div>

          {/* DAMAGED */}

          <div className="
            bg-slate-900/70
            border
            border-white/10
            rounded-3xl
            p-5
            flex
            justify-between
            items-center
          ">

            <div>

              <h3 className="
                text-xl
                font-bold
              ">
                Damaged Inventory Alerts
              </h3>

              <p className="
                text-slate-400
                mt-2
                text-sm
              ">
                Alert when damaged inventory increases
              </p>

            </div>

            <input
              type="checkbox"
              checked={
                alertSettings.damagedInventoryAlerts
              }
              onChange={(e) =>
                setAlertSettings({
                  ...alertSettings,
                  damagedInventoryAlerts:
                    e.target.checked,
                })
              }
              className="
                w-6
                h-6
              "
            />

          </div>

        </div>

        {/* THRESHOLDS */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
        ">

          {/* US */}

          <div className="
            bg-slate-900/70
            border
            border-white/10
            rounded-3xl
            p-5
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <Laptop
                size={20}
                className="
                  text-blue-400
                "
              />

              <h3 className="
                text-lg
                font-bold
              ">
                US Threshold
              </h3>

            </div>

            <input
              type="number"
              value={
                alertSettings.usThreshold
              }
              onChange={(e) =>
                setAlertSettings({
                  ...alertSettings,
                  usThreshold:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="
                mt-4
                w-full
                bg-slate-800
                border
                border-white/10
                rounded-2xl
                px-4
                py-3
                outline-none
              "
            />

          </div>

          {/* INDIA */}

          <div className="
            bg-slate-900/70
            border
            border-white/10
            rounded-3xl
            p-5
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <ShieldAlert
                size={20}
                className="
                  text-yellow-400
                "
              />

              <h3 className="
                text-lg
                font-bold
              ">
                India Threshold
              </h3>

            </div>

            <input
              type="number"
              value={
                alertSettings.indiaThreshold
              }
              onChange={(e) =>
                setAlertSettings({
                  ...alertSettings,
                  indiaThreshold:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="
                mt-4
                w-full
                bg-slate-800
                border
                border-white/10
                rounded-2xl
                px-4
                py-3
                outline-none
              "
            />

          </div>

          {/* WORKBOOK */}

          <div className="
            bg-slate-900/70
            border
            border-white/10
            rounded-3xl
            p-5
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <Clock3
                size={20}
                className="
                  text-green-400
                "
              />

              <h3 className="
                text-lg
                font-bold
              ">
                Workbook Reminder
              </h3>

            </div>

            <input
              type="number"
              value={
                alertSettings.workbookReminderHours
              }
              onChange={(e) =>
                setAlertSettings({
                  ...alertSettings,
                  workbookReminderHours:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="
                mt-4
                w-full
                bg-slate-800
                border
                border-white/10
                rounded-2xl
                px-4
                py-3
                outline-none
              "
            />

          </div>

        </div>

        {/* SAVE */}

        <button
          onClick={
            saveAlertSettings
          }
          className="
            bg-green-600
            hover:bg-green-700
            transition
            px-6
            py-4
            rounded-2xl
            font-bold
            flex
            items-center
            gap-3
          "
        >

          <Save size={20} />

          Save Alert Settings

        </button>

      </div>

      {/* ONEDRIVE */}

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
            Workbook Path
          </h2>

          <p className="
      text-slate-400
      mt-2
    ">
            Configure workbook monitoring path
          </p>

        </div>

        {/* FILE PICKER */}

        <div className="
    flex
    items-center
    gap-4
    flex-wrap
  ">

          <input
            type="text"
            value={syncPath}
            readOnly
            placeholder="Select Excel workbook..."
            className="
        flex-1
        bg-slate-900/70
        border
        border-white/10
        rounded-2xl
        px-5
        py-4
        outline-none
        text-slate-300
      "
          />

          <button

            onClick={async () => {

              if (
                !window.electronAPI
              ) {

                alert(
                  "Electron unavailable"
                );

                return;
              }

              const selectedPath =
                await window.electronAPI.selectWorkbook();

              if (
                !selectedPath
              ) {

                return;
              }

              setSyncPath(
                selectedPath
              );

              localStorage.setItem(
                "syncFilePath",
                selectedPath
              );

              setSyncEnabled(
                true
              );

              alert(
                "Workbook selected successfully."
              );
            }}

            className="
        bg-blue-600
        hover:bg-blue-700
        transition
        px-5
        py-4
        rounded-2xl
        font-semibold
        whitespace-nowrap
      "
          >

            Select Workbook

          </button>

          {/* STATUS */}

          <div className={`
      px-4
      py-3
      rounded-2xl
      text-sm
      font-semibold
      ${syncEnabled

              ? "bg-green-600"

              : "bg-slate-700"
            }
    `}>

            {
              syncEnabled

                ? "Configured"

                : "Not Configured"
            }

          </div>

        </div>

      </div>
      {/* RESETS */}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      ">

        {/* SHEETS */}

        <div className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-6
          backdrop-blur-xl
        ">

          <h2 className="
            text-2xl
            font-bold
          ">
            Reset Sheets & Inventory
          </h2>

          <p className="
            text-slate-400
            mt-3
          ">
            Clears uploaded workbook data and laptop inventory
          </p>

          <button
            onClick={
              resetSheetsData
            }
            className="
              mt-6
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

        {/* CANDIDATES */}

        <div className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-6
          backdrop-blur-xl
        ">

          <h2 className="
            text-2xl
            font-bold
          ">
            Reset Candidates CRM
          </h2>

          <p className="
            text-slate-400
            mt-3
          ">
            Clears candidates, notes, layouts and CRM data
          </p>

          <button
            onClick={
              resetCandidatesData
            }
            className="
              mt-6
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