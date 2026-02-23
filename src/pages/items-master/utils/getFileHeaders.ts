import * as XLSX from "xlsx";

/**
 * Reads headers (first row) from an Excel or CSV file in the browser
 * @param file - File object from file input
 * @returns Promise<string[]> - Array of header names
 */
export async function getFileHeaders(file: File): Promise<string[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    return (rows[0] as string[]).map(h => String(h || "").trim()).filter(Boolean);
}
