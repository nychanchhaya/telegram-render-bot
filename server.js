import express from 'express';
import bodyParser from 'body-parser';

import { parseTelegramUpdate } from './parser.js';
import { appendSubmission, updateSubmission } from './sheet.js';

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    const record = parseTelegramUpdate(update);
    if (!record) {
      return res.sendStatus(200);
    }

    if (record.edited) {
      await updateSubmission(record);
      console.log('Updated row for edited message', record.message_id);
    } else {
      await appendSubmission(record);
      console.log('Appended new row', record.message_id);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error', err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
