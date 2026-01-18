/**
 * Normalize parsed Telegram data into a flat,
 * Google-Sheet-ready record.
 */
export function normalizeRecord(parsed) {
  const now = new Date().toISOString();

  return {
    message_id: String(parsed.message_id),
    chat_id: String(parsed.chat_id),
    chat_title: parsed.chat_title || '',
    username: parsed.username || '',
    user_id: parsed.user_id || '',

    // Outlet
    outlet_id: parsed.outlet_id || 'Required',
    outlet_name: parsed.outlet_name || 'Required',

    // Salesman
    salesman_id: parsed.salesman_id || parsed.user_id || '',

    // Media
    photo_count: parsed.photo_count || 0,
    photo_file_ids: parsed.photo_file_ids?.join(',') || '',
    photo_width: parsed.photo_width || '',
    photo_height: parsed.photo_height || '',
    photo_size: parsed.photo_size || '',

    // Caption
    caption_raw: parsed.caption_raw || '',
    caption: parsed.caption || 'Required',

    // Location
    latitude: parsed.latitude ?? 'Required',
    longitude: parsed.longitude ?? 'Required',

    // Forward / origin
    is_forwarded: parsed.is_forwarded ? 'YES' : 'NO',
    original_sender: parsed.original_sender || '',

    // Audit
    created_at: now,
    edited_at: '',
    edited_by: '',
  };
}
