import express from 'express';
import bodyParser from 'body-parser';

import { parseTelegramUpdate } from './parser.js';
import { normalizeRecord } from './normalize.js';
import { appendRow, updateRowByMessageId } from './sheet.js';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;

app.post('/', async (req, res) => {
  try {
    const update = req.body;

    // --- EDIT MESSAGE ---
    if (update.edited_message) {
      const parsed = parseTelegramUpdate(update.edited_message);
      const normalized = normalizeRecord(parsed);

      await updateRowByMessageId(parsed.message_id, {
        caption: normalized.caption,
        outlet_id: normalized.outlet_id,
        outlet_name: normalized.outlet_name,
        edited_at: new Date().toISOString(),
        edited_by: normalized.username
      });

      return res.sendStatus(200);
    }

    // --- NEW MESSAGE ---
    if (update.message) {
      const parsed = parseTelegramUpdate(update.message);
      const normalized = normalizeRecord(parsed);

      await appendRow(normalized);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
});

app.get('/', (_, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
