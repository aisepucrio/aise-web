/**
 * Cliente Google Sheets e operações básicas
 */

import { google } from "googleapis";

/**
 * Configura e retorna cliente autenticado do Google Sheets
 */
export function getAuthenticatedClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error(
      "GOOGLE_CLIENT_EMAIL ou GOOGLE_PRIVATE_KEY não configurado"
    );
  }

  // Ajusta quebras de linha que normalmente são escapadas em envs
  const fixedPrivateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: fixedPrivateKey,
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/spreadsheets", // Para escrita
    ],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Lê dados de uma aba específica do Google Sheets
 */
export async function readSheetData(sheetName: string): Promise<string[][]> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID não configurado");
  }

  const sheets = getAuthenticatedClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:Z`, // Lê todas as colunas até Z
  });

  return (response.data.values as string[][]) || [];
}

/**
 * Escreve uma linha em uma planilha (append)
 */
export async function appendRow(
  sheetName: string,
  range: string,
  row: string[]
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID não configurado");
  }

  const sheets = getAuthenticatedClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!${range}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

/**
 * Atualiza uma linha específica na planilha
 */
export async function updateRow(
  sheetName: string,
  rowNumber: number,
  range: string,
  row: string[]
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID não configurado");
  }

  const sheets = getAuthenticatedClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A${rowNumber}:${range.split(":")[1]}${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

/**
 * Limpa um range na planilha
 */
export async function clearRange(
  sheetName: string,
  range: string
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID não configurado");
  }

  const sheets = getAuthenticatedClient();

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${sheetName}!${range}`,
  });
}

/**
 * Encontra a linha de um item pelo ID
 */
export async function findRowByField(
  sheetName: string,
  fieldIndex: number,
  value: string
): Promise<number | null> {
  const rows = await readSheetData(sheetName);

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][fieldIndex]?.toLowerCase() === value.toLowerCase()) {
      return i + 1; // +1 porque as linhas do Google Sheets são 1-indexed
    }
  }

  return null;
}
