import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getSheet() {
  const doc = new GoogleSpreadsheet(SHEET_ID, auth);
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle['Submissions'];
  if (!sheet) {
    throw new Error('Sheet "Submissions" not found');
  }

  return sheet;
}

/**
 * Append new submission
 */
export async function appendSubmission(record) {
  const sheet = await getSheet();

  await sheet.addRow({
    Record_Type: 'NEW',
    Message_ID: record.message_id,
    Telegram_Time: record.telegram_date,
    Group_ID: record.group_id,
    Group_Name: record.group_name,
    Salesman_ID: record.salesman_id,
    Salesman_User: record.salesman_username,
    Salesman_Source: 'telegram',
    Outlet_ID: record.outlet_id,
    Outlet_Name: record.outlet_name,
    Caption_Raw: record.caption_raw,
    Caption_Valid: record.caption_normalized,
    Photo_Count: record.photo_count,
    Location_Lat: record.latitude,
    Location_Lng: record.longitude,
    Location_Status: record.latitude === 'REQUIRED' ? 'REQUIRED' : 'OK',
    Edited: false,
    Edited_By: '',
    Edited_At: '',
    Created_At: record.received_at,
  });
}

/**
 * Update row when message edited
 */
export async function updateRowByMessageId(messageId, updates) {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const row = rows.find(r => String(r.Message_ID) === String(messageId));
  if (!row) {
    console.warn('No row found for message_id', messageId);
    return;
  }

  row.Caption_Raw = updates.caption_raw;
  row.Caption_Valid = updates.caption_normalized;
  row.Outlet_ID = updates.outlet_id;
  row.Outlet_Name = updates.outlet_name;
  row.Photo_Count = updates.photo_count;
  row.Location_Lat = updates.latitude;
  row.Location_Lng = updates.longitude;
  row.Location_Status = updates.latitude === 'REQUIRED' ? 'REQUIRED' : 'OK';
  row.Edited = true;
  row.Edited_By = updates.salesman_username;
  row.Edited_At = updates.received_at;

  await row.save();
}
