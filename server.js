import express from "express";

const app = express();

/* ===============================
   REQUIRED MIDDLEWARE
================================ */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ROOT CHECK (BROWSER / RENDER)
================================ */
app.get("/", (req, res) => {
  res.status(200).send("OK - Preview Mode");
});

/* ===============================
   TELEGRAM WEBHOOK (PREVIEW ONLY)
================================ */
app.post("/webhook", (req, res) => {
  const msg = req.body?.message;

  if (!msg) {
    console.log("⚠️ No message object in update");
    return res.sendStatus(200);
  }

  // ---- USER ----
  const username =
    msg.from?.username ??
    msg.from?.first_name ??
    "UNKNOWN_USER";

  // ---- GROUP ----
  const groupName = msg.chat?.title ?? "PRIVATE_CHAT";
  const groupId = msg.chat?.id ?? "N/A";

  // ---- TIME ----
  const timestamp = msg.date
    ? new Date(msg.date * 1000).toISOString()
    : "NO_DATE";

  // ---- PHOTO (BEST QUALITY) ----
  let bestPhoto = null;
  if (Array.isArray(msg.photo) && msg.photo.length > 0) {
    bestPhoto = msg.photo[msg.photo.length - 1];
  }

  // ---- PREVIEW OUTPUT ----
  console.log("========== TELEGRAM DATA PREVIEW ==========");
  console.log("User      :", username);
  console.log("Group     :", groupName);
  console.log("Group ID  :", groupId);
  console.log("Time (ISO):", timestamp);

  if (bestPhoto) {
    console.log("Photo width :", bestPhoto.width);
    console.log("Photo ID    :", bestPhoto.file_id);
    console.log("Photo size  :", bestPhoto.file_size);
  } else {
    console.log("No photo in this message");
  }

  console.log("==========================================");

  // Always respond OK to Telegram
  res.sendStatus(200);
});

/* ===============================
   CATCH ALL (HEALTH CHECKS)
================================ */
app.all("*", (req, res) => {
  console.log("ℹ️ Other request:", req.method, req.url);
  res.sendStatus(200);
});

/* ===============================
   RENDER PORT
================================ */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
