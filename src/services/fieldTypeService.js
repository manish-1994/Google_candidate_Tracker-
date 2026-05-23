export const detectFieldType = (
  columnName
) => {

  const lower =
    columnName.toLowerCase();

  // STRICT BOOLEAN FIELDS ONLY
  const checkboxFields = [
    "onboarded",
    "is onboarded",
    "completed",
    "active",
  ];

  if (
    checkboxFields.includes(
      lower
    )
  ) {

    return "checkbox";
  }

  return "text";
};