import { GoogleSpreadsheet } from "google-spreadsheet";

export async function initSheet() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT.client_email,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT.private_key.replace(/\\n/g, "\n")
  });

  await doc.loadInfo();

  console.log("🟢 Google Sheet connected:");
  console.log("📄 Title:", doc.title);
  console.log("📑 Sheets:", Object.keys(doc.sheetsByTitle));

  return doc.sheetsByTitle["data"];
}
