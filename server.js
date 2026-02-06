import express from "express";
import bodyParser from "body-parser";
import { appendSubmission, updateSubmission } from "./sheet.js";

const app = express();
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  try {
    const update = req.body;

    if (update.message?.photo) {
      await appendSubmission(update.message);
    }

    if (update.edited_message) {
      await updateSubmission(update.edited_message);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
