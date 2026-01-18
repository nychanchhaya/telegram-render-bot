// normalize.js

export function normalizeCaption(captionRaw) {
  if (!captionRaw || typeof captionRaw !== "string") {
    return {
      outlet_id: "REQUIRED",
      outlet_name: "REQUIRED",
      caption_normalized: "REQUIRED"
    };
  }

  const cleaned = captionRaw.trim();

  // Support:
  // 1234567 - Raksmy
  // Raksmy - 1234567
  const parts = cleaned.split("-").map(p => p.trim());

  let outlet_id = "REQUIRED";
  let outlet_name = "REQUIRED";

  if (parts.length === 2) {
    if (/^\d+$/.test(parts[0])) {
      outlet_id = parts[0];
      outlet_name = parts[1];
    } else if (/^\d+$/.test(parts[1])) {
      outlet_id = parts[1];
      outlet_name = parts[0];
    }
  }

  return {
    outlet_id,
    outlet_name,
    caption_normalized:
      outlet_id !== "REQUIRED"
        ? `${outlet_id} | ${outlet_name}`
        : "REQUIRED"
  };
}

export function normalizeRecord(raw) {
  const captionRaw = raw.caption || null;
  const normalizedCaption = normalizeCaption(captionRaw);

  return {
    message_id: raw.message_id,
    group_id: raw.chat?.id,
    group_name: raw.chat?.title || null,

    salesman_username: raw.from?.username || null,
    salesman_id: "REQUIRED",

    caption_raw: captionRaw,
    ...normalizedCaption,

    photo_count: raw.photo?.length || 0,
    photo_file_id: raw.photo?.at(-1)?.file_id || null,
    photo_width: raw.photo?.at(-1)?.width || null,
    photo_height: raw.photo?.at(-1)?.height || null,

    latitude: raw.location?.latitude ?? "REQUIRED",
    longitude: raw.location?.longitude ?? "REQUIRED",

    telegram_date: new Date(raw.date * 1000).toISOString(),
    received_at: new Date().toISOString(),

    edited: false
  };
}
