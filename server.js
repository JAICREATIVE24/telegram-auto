const express = require("express");
const axios = require("axios");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ENV (set kat Railway nanti)
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Safety check (elak crash senyap)
if (!BOT_TOKEN || !CHAT_ID) {
  console.log("❌ BOT_TOKEN atau CHAT_ID tak set");
}

// Function hantar Telegram
async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: text,
    });
    console.log("✅ Message sent to Telegram");
  } catch (err) {
    console.log("❌ Telegram error:", err.response?.data || err.message);
  }
}

// Webhook (ToyyibPay)
app.post("/webhook", async (req, res) => {
  console.log("📥 Webhook masuk:", req.body);

  await sendTelegram("🔥 Payment masuk!");

  res.send("OK");
});

// Test route
app.get("/", (req, res) => {
  res.send("Server hidup 🚀");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ON port ${PORT}`);
});
