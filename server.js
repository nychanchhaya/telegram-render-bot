import express from "express";
import bodyParser from "body-parser";
import { parseTelegramUpdate } from "./parser.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Telegram Visibility Bot is running");
});

// ✅ TELEGRAM WEBHOOK — MUST MATCH /webhook
app.post("/webhook", async (req, res) => {
  try {
    console.log("=== TELEGRAM WEBHOOK RECEIVED ===");
    console.log(JSON.stringify(req.body, null, 2));

    // Process update (photo, edit, etc.)
    await parseTelegramUpdate(req.body);

    // Telegram requires fast 200 OK
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.sendStatus(200); // Still return 200 to avoid Telegram retry loop
  }
});

app.listen(PORT, () => {
  console.log("===========================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook endpoint: /webhook`);
  console.log("===========================================");
});
