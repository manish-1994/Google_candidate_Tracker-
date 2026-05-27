import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AppContext =
  createContext();

const defaultColumns = [
  {
    id: 1,
    name: "Candidate Name",
    type: "text",
  },

  {
    id: 2,
    name: "Email",
    type: "text",
  },

  {
    id: 3,
    name: "Recruiter",
    type: "text",
  },

  {
    id: 4,
    name: "Onboarded",
    type: "checkbox",
  },

  {
    id: 5,
    name: "Joining Date",
    type: "date",
  },

  {
    id: 6,
    name: "Notes",
    type: "textarea",
  },
];

const defaultCardSettings = {
  titleField:
    "Candidate Name",

  subtitleField:
    "Email",

  badgeField:
    "Onboarded",

  laptopField:
    "assignedLaptopId",
};

export function AppProvider({
  children,
}) {
  // =========================
  // LAPTOPS
  // =========================

  const [
    laptops,
    setLaptops,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "laptops"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  // =========================
  // SHEETS
  // =========================

  const [
    sheetsData,
    setSheetsData,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "sheetsData"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  // =========================
  // ACTIVE SHEET
  // =========================

  const [
    activeSheetName,
    setActiveSheetName,
  ] = useState(() => {
    return (
      localStorage.getItem(
        "activeSheetName"
      ) || ""
    );
  });

  // =========================
  // CANDIDATES
  // =========================

  const [
    candidates,
    setCandidates,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "candidates"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  // =========================
  // CANDIDATE COLUMNS
  // =========================

  const [
    candidateColumns,
    setCandidateColumns,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "candidateColumns"
      );

    return saved
      ? JSON.parse(saved)
      : defaultColumns;
  });

  // =========================
  // CARD SETTINGS
  // =========================



  const getValidField = (
    savedField,
    fallbackField,
    columns
  ) => {
    const exists =
      columns.find(
        (col) =>
          col.name ===
          savedField
      );

    if (exists) {
      return savedField;
    }

    return (
      columns[0]?.name ||
      fallbackField
    );
  };

  const [
    candidateCardSettings,
    setCandidateCardSettings,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "candidateCardSettings"
      );

    const parsed = saved
      ? JSON.parse(saved)
      : defaultCardSettings;

    return {
      titleField:
        parsed.titleField,

      subtitleField:
        parsed.subtitleField,

      badgeField:
        parsed.badgeField,

      laptopField:
        parsed.laptopField,
    };
  });

  // AUTO HEAL SETTINGS
  useEffect(() => {
    setCandidateCardSettings(
      (prev) => ({
        ...prev,

        titleField:
          getValidField(
            prev.titleField,
            "Candidate Name",
            candidateColumns
          ),

        subtitleField:
          getValidField(
            prev.subtitleField,
            "Email",
            candidateColumns
          ),
      })
    );
  }, [candidateColumns]);

  // =========================
  // SAVE SYSTEM
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "laptops",
      JSON.stringify(
        laptops
      )
    );
  }, [laptops]);

  useEffect(() => {
    localStorage.setItem(
      "sheetsData",
      JSON.stringify(
        sheetsData
      )
    );
  }, [sheetsData]);

  useEffect(() => {
    localStorage.setItem(
      "activeSheetName",
      activeSheetName
    );
  }, [activeSheetName]);

  useEffect(() => {
    localStorage.setItem(
      "candidates",
      JSON.stringify(
        candidates
      )
    );
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(
      "candidateColumns",
      JSON.stringify(
        candidateColumns
      )
    );
  }, [candidateColumns]);

  useEffect(() => {
    localStorage.setItem(
      "candidateCardSettings",
      JSON.stringify(
        candidateCardSettings
      )
    );
  }, [
    candidateCardSettings,
  ]);

  // =========================
  // SHEET HELPERS
  // =========================

  const currentSheet =
    useMemo(() => {
      return sheetsData.find(
        (sheet) =>
          sheet.name ===
          activeSheetName
      );
    }, [
      sheetsData,
      activeSheetName,
    ]);

  const updateSheet =
    (
      sheetName,
      updates
    ) => {
      const updatedSheets =
        sheetsData.map(
          (sheet) => {
            if (
              sheet.name !==
              sheetName
            ) {
              return sheet;
            }

            return {
              ...sheet,
              ...updates,
            };
          }
        );

      setSheetsData(
        updatedSheets
      );
    };

  const deleteSheet =
    (sheetName) => {
      const updatedSheets =
        sheetsData.filter(
          (sheet) =>
            sheet.name !==
            sheetName
        );

      setSheetsData(
        updatedSheets
      );

      if (
        activeSheetName ===
        sheetName
      ) {
        setActiveSheetName(
          updatedSheets[0]
            ?.name || ""
        );
      }
    };

  const renameSheet =
    (
      oldName,
      newName
    ) => {
      const exists =
        sheetsData.find(
          (sheet) =>
            sheet.name ===
            newName
        );

      if (exists) {
        return false;
      }

      const updatedSheets =
        sheetsData.map(
          (sheet) => {
            if (
              sheet.name ===
              oldName
            ) {
              return {
                ...sheet,
                name: newName,
              };
            }

            return sheet;
          }
        );

      setSheetsData(
        updatedSheets
      );

      if (
        activeSheetName ===
        oldName
      ) {
        setActiveSheetName(
          newName
        );
      }

      return true;
    };

  // =========================
  // CANDIDATES
  // =========================

  const addCandidate =
    () => {
      const newCandidate =
      {
        id:
          Date.now(),

        assignedLaptopId:
          "",
      };

      candidateColumns.forEach(
        (column) => {
          newCandidate[
            column.name
          ] =
            column.type ===
              "checkbox"
              ? false
              : "";
        }
      );

      setCandidates([
        newCandidate,
        ...candidates,
      ]);
    };

  const updateCandidate =
    (
      id,
      field,
      value
    ) => {
      const updated =
        candidates.map(
          (candidate) => {
            if (
              candidate.id ===
              id
            ) {
              return {
                ...candidate,
                [field]:
                  value,
              };
            }

            return candidate;
          }
        );

      setCandidates(
        updated
      );
    };

  const deleteCandidate =
    (id) => {
      const updated =
        candidates.filter(
          (candidate) =>
            candidate.id !==
            id
        );

      setCandidates(
        updated
      );
    };

  // =========================
  // COLUMNS
  // =========================

  const addCandidateColumn =
    (
      name,
      type
    ) => {

      // PREVENT EMPTY

      if (
        !name?.trim()
      ) {

        return;
      }

      // PREVENT DUPLICATES

      const exists =
        candidateColumns.find(
          (column) =>

            column.name
              .toLowerCase()
              .trim() ===

            name
              .toLowerCase()
              .trim()
        );

      if (exists) {

        alert(
          "Field already exists."
        );

        return;
      }

      const cleanName =
        name.trim();

      const newColumn =
      {
        id:
          Date.now(),

        name:
          cleanName,

        type,
      };

      // UPDATE COLUMNS

      const updatedColumns = [

        ...candidateColumns,

        newColumn,
      ];

      setCandidateColumns(
        updatedColumns
      );

      // UPDATE CANDIDATES

      const updatedCandidates =
        candidates.map(
          (
            candidate
          ) => ({

            ...candidate,

            [cleanName]:

              type ===
                "checkbox"

                ? false

                : "",
          })
        );

      setCandidates(
        updatedCandidates
      );
    };

  const moveFieldUp =
    (id) => {
      const index =
        candidateColumns.findIndex(
          (col) =>
            col.id === id
        );

      if (index <= 0)
        return;

      const updated =
        [...candidateColumns];

      [
        updated[index - 1],
        updated[index],
      ] = [
          updated[index],
          updated[index - 1],
        ];

      setCandidateColumns(
        updated
      );
    };


  const moveFieldDown =
    (id) => {
      const index =
        candidateColumns.findIndex(
          (col) =>
            col.id === id
        );

      if (
        index ===
        candidateColumns.length -
        1
      )
        return;

      const updated =
        [...candidateColumns];

      [
        updated[index + 1],
        updated[index],
      ] = [
          updated[index],
          updated[index + 1],
        ];

      setCandidateColumns(
        updated
      );
    };

  // =========================
  // CARD SETTINGS
  // =========================

  const updateCardSettings =
    (
      field,
      value
    ) => {
      setCandidateCardSettings({
        ...candidateCardSettings,

        [field]:
          value,
      });
    };

  // =========================
  // LAPTOP ASSIGNMENT
  // =========================

  const assignLaptop =
    (
      candidateId,
      laptopValue
    ) => {

      // =====================
      // UPDATE CANDIDATE
      // =====================

      const updatedCandidates =
        candidates.map(
          (candidate) => {

            if (
              String(candidate.id) ===
              String(candidateId)
            ) {

              return {

                ...candidate,

                assignedLaptopId:
                  laptopValue,
              };
            }

            return candidate;
          }
        );

      setCandidates(
        updatedCandidates
      );

      // =====================
      // UPDATE LAPTOP STATUS
      // =====================

      const updatedLaptops =
        laptops.map(
          (laptop) => {

            // FIND SERIAL COLUMN

            const serialKey =
              Object.keys(
                laptop
              ).find(
                (key) =>

                  key
                    ?.toLowerCase()
                    .includes(
                      "serial"
                    )
              );

            // SERIAL VALUE

            const serialValue =
              serialKey

                ? laptop[
                serialKey
                ]

                : null;

            // ASSET ID

            const assetId =
              laptop[
              "Akraya Asset ID"
              ];

            // MATCH CHECK

            const matches =

              String(assetId || "")
                .trim()
                .toLowerCase()

              ===

              String(laptopValue || "")
                .trim()
                .toLowerCase()

              ||

              String(serialValue || "")
                .trim()
                .toLowerCase()

              ===

              String(laptopValue || "")
                .trim()
                .toLowerCase();

            // UPDATE STATUS

            if (matches) {

              return {

                ...laptop,

                status:
                  "Assigned",
              };
            }

            return laptop;
          }
        );

      setLaptops(
        updatedLaptops
      );
    };
  // =========================
  // AVAILABLE LAPTOPS
  // =========================

  const availableLaptops =
    useMemo(() => {

      return laptops.filter(
        (laptop) => {

          const status =
            String(
              laptop.status || ""
            )
              .toLowerCase()
              .trim();

          // ONLY BLOCK DAMAGED

          return (
            status !==
            "damaged"
          );
        }
      );

    }, [laptops]);

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

    return saved
      ? JSON.parse(saved)
      : {

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
  // WORKBOOK TIMESTAMP
  // =========================

  const [
    workbookLastUpdated,
    setWorkbookLastUpdated,
  ] = useState(() => {

    const saved =
      localStorage.getItem(
        "workbookLastUpdated"
      );

    return saved
      ? Number(saved)
      : Date.now();
  });

  // =========================
  // SAVE ALERT SETTINGS
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "alertSettings",
      JSON.stringify(
        alertSettings
      )
    );

  }, [alertSettings]);

  useEffect(() => {

    localStorage.setItem(
      "workbookLastUpdated",
      workbookLastUpdated
    );

  }, [
    workbookLastUpdated,
  ]);

  // =========================
  // GENERATED ALERTS
  // =========================

  const generatedAlerts =
    useMemo(() => {

      const alerts = [];

      // =====================
      // US INVENTORY
      // =====================

      const usAvailable =
        availableLaptops.filter(
          (laptop) =>

            (
              laptop.Country ||
              ""
            )
              .toLowerCase()
              .includes("usa")
        ).length;

      if (
        usAvailable <
        alertSettings.usThreshold
      ) {

        alerts.push({

          type:
            "inventory",

          level:
            usAvailable < 10

              ? "critical"

              : "warning",

          title:
            "US Chromebook Inventory Low",

          description:
            `Only ${usAvailable} US Chromebooks available.`,
        });
      }

      // =====================
      // INDIA INVENTORY
      // =====================

      const indiaAvailable =
        availableLaptops.filter(
          (laptop) =>

            (
              laptop.Country ||
              ""
            )
              .toLowerCase()
              .includes(
                "india"
              )
        ).length;

      if (
        indiaAvailable <
        alertSettings.indiaThreshold
      ) {

        alerts.push({

          type:
            "inventory",

          level:
            indiaAvailable < 2

              ? "critical"

              : "warning",

          title:
            "India Chromebook Inventory Low",

          description:
            `Only ${indiaAvailable} India Chromebooks available.`,
        });
      }

      return alerts;

    }, [

      availableLaptops,

      alertSettings,
    ]);

  return (
    <AppContext.Provider
      value={{
        // LAPTOPS
        laptops,
        setLaptops,

        availableLaptops,

        // SHEETS
        sheetsData,
        setSheetsData,

        activeSheetName,
        setActiveSheetName,

        currentSheet,

        updateSheet,
        deleteSheet,
        renameSheet,

        // CANDIDATES
        candidates,
        setCandidates,

        addCandidate,
        updateCandidate,
        deleteCandidate,

        // COLUMNS
        candidateColumns,
        setCandidateColumns,

        addCandidateColumn,

        moveFieldUp,
        moveFieldDown,

        // CARD SETTINGS
        candidateCardSettings,
        setCandidateCardSettings,

        updateCardSettings,

        // LAPTOPS
        assignLaptop,
        generatedAlerts,

        alertSettings,
        setAlertSettings,

        workbookLastUpdated,
        setWorkbookLastUpdated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(
    AppContext
  );
}