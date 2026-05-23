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
      const newColumn =
        {
          id:
            Date.now(),

          name,
          type,
        };

      setCandidateColumns([
        ...candidateColumns,
        newColumn,
      ]);

      const updated =
        candidates.map(
          (
            candidate
          ) => ({
            ...candidate,

            [name]:
              type ===
              "checkbox"
                ? false
                : "",
          })
        );

      setCandidates(
        updated
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
      assetId
    ) => {
      const updatedCandidates =
        candidates.map(
          (candidate) => {
            if (
              candidate.id ===
              candidateId
            ) {
              return {
                ...candidate,

                assignedLaptopId:
                  assetId,
              };
            }

            return candidate;
          }
        );

      setCandidates(
        updatedCandidates
      );

      const updatedLaptops =
        laptops.map(
          (laptop) => {
            if (
              laptop[
                "Akraya Asset ID"
              ] ===
              assetId
            ) {
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
        (laptop) =>
          laptop.status !==
          "Assigned"
      );
    }, [laptops]);

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