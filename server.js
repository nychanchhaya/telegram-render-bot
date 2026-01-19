import express from "express";
import { parseUpdate } from "./parser.js";
import { appendSubmission, updateSubmission } from "./sheet.js";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const record = parseUpdate(req.body);
    if (!record) return res.sendStatus(200);

    if (record.edited) {
      await updateSubmission(record);
    } else {
      await appendSubmission(record);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

app.get("/", (_, res) => res.send("Telegram bot is live"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
