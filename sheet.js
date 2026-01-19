import { GoogleSpreadsheet } from "google-spreadsheet";

const SHEET_NAME = "Submissions";

async function getDoc() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n")
  });

  await doc.loadInfo();
  return doc;
}

export async function appendSubmission(r) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[SHEET_NAME];

  await sheet.addRow({
    received_at: r.received_at,
    telegram_date: r.telegram_date,
    edited: false,
    edited_at: "",
    edited_by: "",
    group_id: r.group_id,
    group_name: r.group_name,
    message_id: r.message_id,
    telegram_username: r.telegram_username,
    outlet_id: r.outlet_id,
    outlet_name: r.outlet_name,
    caption_raw: r.caption_raw,
    caption_normalized: r.caption_normalized,
    photo_file_id: r.photo_file_id,
    photo_width: r.photo_width,
    photo_height: r.photo_height,
    photo_count: r.photo_count
  });
}

export async function updateSubmission(r) {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[SHEET_NAME];
  const rows = await sheet.getRows();

  const row = rows.find(x =>
    String(x.message_id) === String(r.message_id) &&
    String(x.group_id) === String(r.group_id)
  );

  if (!row) return;

  row.edited = true;
  row.edited_at = r.edited_at;
  row.edited_by = r.edited_by;
  row.caption_raw = r.caption_raw;
  row.caption_normalized = r.caption_normalized;

  await row.save();
}
