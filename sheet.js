import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

// --- AUTH ---
const auth = new JWT({
  email: SERVICE_ACCOUNT.client_email,
  key: SERVICE_ACCOUNT.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const doc = new GoogleSpreadsheet(SHEET_ID, auth);

async function loadSheet() {
  await doc.loadInfo();
  return doc.sheetsByIndex[0]; // first sheet
}

/**
 * Append new submission row
 */
export async function appendRow(record) {
  const sheet = await loadSheet();
  await sheet.addRow(record);
}

/**
 * Update row by Telegram message_id (edit tracking)
 */
export async function updateRowByMessageId(messageId, updates) {
  const sheet = await loadSheet();
  const rows = await sheet.getRows();

  const row = rows.find(r => r.message_id === String(messageId));
  if (!row) return false;

  Object.entries(updates).forEach(([k, v]) => {
    row[k] = v;
  });

  await row.save();
  return true;
}
