export function cleanCellValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (typeof value === "object") {
    // Hyperlinks
    if (value.hyperlink) {
      return value.text || "";
    }

    // Rich text
    if (value.richText) {
      return value.richText
        .map((part) => part.text)
        .join("");
    }

    // Formula result
    if (
      value.result !== undefined
    ) {
      return value.result;
    }

    // Generic text
    if (value.text) {
      return value.text;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return value;
}

export function generateUniqueHeaders(
  headers = []
) {
  const used = {};

  return headers.map(
    (header, index) => {
      let finalHeader = header
        ? String(header).trim()
        : `Column_${index + 1}`;

      if (!finalHeader) {
        finalHeader = `Column_${index + 1}`;
      }

      if (
        !used[finalHeader]
      ) {
        used[finalHeader] = 1;

        return finalHeader;
      }

      used[finalHeader] += 1;

      return `${finalHeader}_${
        used[finalHeader]
      }`;
    }
  );
}

export function buildColumnDefs(
  headers = []
) {
  return headers
    .filter(Boolean)
    .map((header) => ({
      field: header,

      headerName: header,

      editable: true,

      sortable: true,

      filter: true,

      floatingFilter: true,

      resizable: true,

      minWidth: 220,

      width: 280,
    }));
}

export function parseWorksheet(
  worksheet
) {
  const rows = [];

  worksheet.eachRow(
    {
      includeEmpty: true,
    },
    (row) => {
      const rowValues = [];

      const maxColumns =
        worksheet.columnCount;

      for (
        let i = 1;
        i <= maxColumns;
        i++
      ) {
        rowValues.push(
          cleanCellValue(
            row.getCell(i).value
          )
        );
      }

      rows.push(rowValues);
    }
  );

  if (!rows.length) {
    return {
      rowData: [],
      columnDefs: [],
    };
  }

  // YOUR WORKBOOK USES ROW 1 HEADERS
  const rawHeaders =
    rows[0] || [];

  const cleanedHeaders =
    rawHeaders.map((header) => {
      if (
        header === null ||
        header === undefined
      ) {
        return "";
      }

      return String(
        header
      ).trim();
    });

  // KEEP ONLY VALID HEADERS
  const validHeaderIndexes =
    cleanedHeaders
      .map(
        (
          header,
          index
        ) => ({
          header,
          index,
        })
      )
      .filter(
        (item) =>
          item.header !== ""
      );

  const finalHeaders =
    generateUniqueHeaders(
      validHeaderIndexes.map(
        (item) =>
          item.header
      )
    );

  const columnDefs =
    buildColumnDefs(
      finalHeaders
    );

  const rowData = rows
    .slice(1)
    .filter((row) =>
      row.some(
        (cell) =>
          cell !== ""
      )
    )
    .map((row, rowIndex) => {
      const rowObject = {
        __rowId:
          crypto.randomUUID?.() ||
          `${Date.now()}_${rowIndex}`,
      };

      validHeaderIndexes.forEach(
        (
          item,
          headerPosition
        ) => {
          rowObject[
            finalHeaders[
              headerPosition
            ]
          ] =
            row[item.index] ??
            "";
        }
      );

      return rowObject;
    });

  return {
    rowData,

    columnDefs,
  };
}