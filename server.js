import express from 'express';
import { parseTelegramUpdate } from './parser.js';
import { appendSubmission, updateRowByMessageId } from './sheet.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    const record = parseTelegramUpdate(update);

    if (!record) {
      return res.status(200).send('Ignored');
    }

    if (record.edited) {
      console.log('>>> UPDATE EXISTING ROW');
      await updateRowByMessageId(record.message_id, record);
    } else {
      console.log('>>> APPEND NEW ROW');
      await appendSubmission(record);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('ERROR');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
