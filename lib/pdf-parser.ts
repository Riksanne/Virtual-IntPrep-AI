const pdfParse = require("pdf-parse");

/**
 * Parses a PDF buffer and extracts its text content.
 *
 * @param buffer - The raw binary buffer of the PDF file.
 * @returns A promise that resolves to the extracted text found in the PDF.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error: any) {
    console.error("Error parsing PDF locally:", error);
    throw new Error(`PDF Parsing Error: ${error?.message || "Unknown error"}`);
  }
}
