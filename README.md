# Mines Game Telegram WebApp

This is a simple demo of a 5x5 mines game with selectable mine counts (3, 5, 10, or 24). It uses a basic Express server to serve static files and provide fake deposit and withdrawal APIs. The admin panel is accessible via `/admin?userId=1286239181` and shows balances and transaction logs in memory. A Telegram bot is included to launch the WebApp.

## Running

```bash
npm install
BOT_TOKEN=YOUR_TOKEN WEBAPP_URL=https://your.host npm start
```

Then open `http://localhost:3000` in your browser or start the Telegram bot. This is only a demo; deposits and withdrawals are simulated and do not involve real payments.
