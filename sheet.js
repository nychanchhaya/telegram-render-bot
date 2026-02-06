import { GoogleSpreadsheet } from "google-spreadsheet";

const SHEET_NAME = "Submissions"; // ⚠️ DO NOT CHANGE

// ✅ MUST BE DEFINED BEFORE USE
async function getSheet() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[SHEET_NAME];
  if (!sheet) {
    throw new Error(`Submissions sheet not found`);
  }

  return sheet;
}

// ================= APPEND =================
export async function appendSubmission(message) {
  const sheet = await getSheet();

  await sheet.addRow({
    message_id: message.message_id,
    group_id: message.chat?.id || "",
    group_name: message.chat?.title || "",
    telegram_username: message.from?.username || "",
    salesman_id: "",
    outlet_id: "",
    outlet_name: "",
    caption_raw: message.caption || "",
    caption_normalized: "",
    photo_count: message.photo ? message.photo.length : 0,
    latitude: message.location?.latitude || "",
    longitude: message.location?.longitude || "",
    edited: false,
    edited_at: "",
    edited_by: "",
    created_at: new Date().toISOString(),
  });
}

// ================= UPDATE =================
export async function updateSubmission(editedMessage) {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const row = rows.find(
    r => String(r.message_id) === String(editedMessage.message_id)
  );

  if (!row) return;

  row.caption_raw = editedMessage.caption || row.caption_raw;
  row.edited = true;
  row.edited_at = new Date().toISOString();
  row.edited_by = editedMessage.from?.username || "";

  await row.save();
}
