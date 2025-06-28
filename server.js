const express = require('express');
const path = require('path');
const { Telegraf } = require('telegraf');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const balances = {};
const logs = [];
const ADMIN_ID = '1286239181';

app.post('/api/deposit', (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) return res.status(400).json({ error: 'Missing fields' });
  balances[userId] = (balances[userId] || 0) + Number(amount);
  logs.push({ type: 'deposit', userId, amount, time: Date.now() });
  res.json({ balance: balances[userId] });
});

app.post('/api/withdraw', (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) return res.status(400).json({ error: 'Missing fields' });
  balances[userId] = (balances[userId] || 0) - Number(amount);
  logs.push({ type: 'withdraw', userId, amount, time: Date.now() });
  res.json({ balance: balances[userId] });
});

app.get('/admin', (req, res) => {
  const { userId } = req.query;
  if (userId !== ADMIN_ID) return res.status(403).send('Forbidden');
  res.send(`<pre>${JSON.stringify({ balances, logs }, null, 2)}</pre>`);
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Telegram bot
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || `http://localhost:${PORT}`;

if (BOT_TOKEN) {
  const bot = new Telegraf(BOT_TOKEN);
  bot.start((ctx) => {
    ctx.reply('Open the game', {
      reply_markup: {
        keyboard: [[{ text: 'Play Mines', web_app: { url: WEBAPP_URL } }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  });
  bot.launch();
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} else {
  console.log('BOT_TOKEN not provided, bot not started');
}
