/**
 * Parse Telegram webhook update
 * NO normalization here
 * Output raw, structured data only
 */

export function parseTelegramUpdate(update) {
  const msg =
    update.message ||
    update.edited_message ||
    update.channel_post ||
    update.edited_channel_post;

  if (!msg) return null;

  const photos = msg.photo || [];
  const largestPhoto = photos.length ? photos[photos.length - 1] : null;

  const isForwarded = !!msg.forward_from || !!msg.forward_from_chat;

  return {
    message_id: msg.message_id,
    chat_id: msg.chat?.id,
    chat_title: msg.chat?.title || '',
    username: msg.from?.username || '',
    user_id: msg.from?.id || '',

    // Caption (RAW ONLY)
    caption_raw: msg.caption || '',

    // Photos
    photo_count: photos.length,
    photo_file_ids: photos.map(p => p.file_id),
    photo_width: largestPhoto?.width || '',
    photo_height: largestPhoto?.height || '',
    photo_size: largestPhoto?.file_size || '',

    // Location
    latitude: msg.location?.latitude ?? null,
    longitude: msg.location?.longitude ?? null,

    // Forwarding
    is_forwarded: isForwarded,
    original_sender: isForwarded
      ? msg.forward_from?.username ||
        msg.forward_from_chat?.title ||
        ''
      : '',

    // Metadata
    date: msg.date,
    edited_date: msg.edited_date || null,
  };
}
