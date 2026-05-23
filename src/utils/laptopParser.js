function cleanCellValue(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";
  }

  // HYPERLINKS
  if (
    typeof value === "object" &&
    value.hyperlink
  ) {

    return (
      value.text || ""
    );
  }

  // RICH TEXT
  if (
    typeof value === "object" &&
    value.richText
  ) {

    return value.richText
      .map(
        (part) =>
          part.text
      )
      .join("");
  }

  // FORMULAS
  if (
    typeof value === "object" &&
    value.result
  ) {

    return value.result;
  }

  // GENERIC TEXT
  if (
    typeof value === "object" &&
    value.text
  ) {

    return value.text;
  }

  return value;
}

export function parseLaptopSheets(
  workbook
) {

  const IMPORTANT_SHEETS = [

    "US ChromeBook",

    "INDIA ChromeBook",

    "GLOBAL ChromeBook",

    "Damaged Laptops",

    "MacBook",

  ];

  const laptops = [];

  workbook.worksheets.forEach(
    (sheet) => {

      if (
        !IMPORTANT_SHEETS.includes(
          sheet.name
        )
      ) {
        return;
      }

      const rows = [];

      sheet.eachRow(
        {
          includeEmpty: false,
        },
        (row) => {

          const cleanedRow =
            row.values
              .slice(1)
              .map(
                cleanCellValue
              );

          rows.push(
            cleanedRow
          );

        }
      );

      if (
        rows.length < 2
      ) {
        return;
      }

      const headers =
        rows[0].map(
          (
            header,
            index
          ) =>

            header
              ? String(
                  header
                ).trim()
              : `Column_${
                  index + 1
                }`
        );

      rows
        .slice(1)
        .forEach((row) => {

          const laptop =
            {};

          headers.forEach(
            (
              header,
              index
            ) => {

              laptop[
                header
              ] =
                row[index] ||
                "";

            }
          );

          laptop.deviceType =
            sheet.name.includes(
              "MacBook"
            )
              ? "MacBook"
              : "Chromebook";

          laptop.sourceSheet =
            sheet.name;

          laptop.status =
            sheet.name.includes(
              "Damaged"
            )

              ? "Damaged"

              : laptop[
                  "Unassigned"
                ] ===
                "Assigned"

              ? "Assigned"

              : "Available";

          laptops.push(
            laptop
          );

        });

    }
  );

  return laptops;
}