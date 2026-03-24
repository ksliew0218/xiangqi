export type ExcelExportRow = {
  name: string;
  rating: string;
  state: string;
};

export type BuildResultsWorkbookOptions = {
  sheetName?: string;
  headers?: { name: string; rating: string; state: string };
};

export async function buildResultsWorkbook(
  rows: ExcelExportRow[],
  options?: BuildResultsWorkbookOptions,
): Promise<ArrayBuffer> {
  const sheetName = options?.sheetName ?? "Results";
  const headers = options?.headers ?? {
    name: "Name",
    rating: "Rating",
    state: "State",
  };

  const Excel = (await import("exceljs")).default;
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet(sheetName, {
    properties: { defaultRowHeight: 18 },
  });

  sheet.columns = [
    { header: headers.name, key: "name", width: 28 },
    { header: headers.rating, key: "rating", width: 12 },
    { header: headers.state, key: "state", width: 16 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };

  for (const r of rows) {
    sheet.addRow({
      name: r.name,
      rating: r.rating,
      state: r.state,
    });
  }

  const buf = await workbook.xlsx.writeBuffer();
  return buf as ArrayBuffer;
}

export function downloadArrayBuffer(
  buffer: ArrayBuffer,
  filename: string,
  mime: string,
): void {
  const blob = new Blob([buffer], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
