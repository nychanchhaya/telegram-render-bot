import { normalizeCaption } from "./normalize.js";

export function parseUpdate(update) {
  const msg = update.message || update.edited_message;
  if (!msg || !msg.photo) return null;

  const captionRaw = msg.caption || "";
  const norm = normalizeCaption(captionRaw);

  const photo = msg.photo[msg.photo.length - 1];

  const telegramDate = new Date(msg.date * 1000);
  const receivedAt = new Date();

  return {
    edited: !!update.edited_message,
    edited_at: update.edited_message ? new Date().toISOString() : "",
    edited_by: update.edited_message?.from?.username || "",

    received_at: receivedAt.toISOString(),
    telegram_date: telegramDate.toISOString(),

    group_id: msg.chat.id,
    group_name: msg.chat.title || "",
    message_id: msg.message_id,

    telegram_username: msg.from?.username || "",

    outlet_id: norm.outlet_id || "REQUIRED",
    outlet_name: norm.outlet_name || "",
    caption_raw: captionRaw,
    caption_normalized: norm.normalized,

    photo_file_id: photo.file_id,
    photo_width: photo.width,
    photo_height: photo.height,
    photo_count: msg.photo.length
  };
}
