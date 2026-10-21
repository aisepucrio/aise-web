import "server-only";
import { google } from "googleapis";

// Só o necessário pra ler a aba "Login" (whitelist de quem pode acessar o
// editor). O CRUD de conteúdo via planilha (Team/Tools/Researches/Publications)
// é fluxo morto desde a migração pro Postgres e não foi portado.

function getRequiredEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`${key} não configurado`);
  return v;
}

function getFixedPrivateKey(): string {
  return getRequiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
}

function getAuthenticatedClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: getRequiredEnv("GOOGLE_CLIENT_EMAIL"),
      private_key: getFixedPrivateKey(),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function readSheetData(sheetName: string): Promise<string[][]> {
  const sheets = getAuthenticatedClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getRequiredEnv("GOOGLE_SHEETS_ID"),
    range: `${sheetName}!A1:Z`,
  });

  return (response.data.values as string[][]) || [];
}
