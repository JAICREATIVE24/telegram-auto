const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ===== CONFIG =====
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ===== FUNCTION SEND MESSAGE =====
async function sendMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML"
    });
    console.log("✅ Hantar berjaya:", text);
  } catch (err) {
    console.log("❌ Error:", err.response?.data || err.message);
  }
}

// ===== WEBHOOK =====
app.post("/webhook", async (req, res) => {
  const message = req.body.message;

  if (!message) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text;

  console.log("📩 Message:", text);

  // ===== COMMAND SYSTEM =====

  // START
  if (text === "/start") {
    await sendMessage(chatId,
`👋 Selamat datang ke AUTO DELIVERY SYSTEM

🛒 Taip:
BUY - untuk beli produk
INFO - untuk info`
    );
  }

  // BUY
  else if (text === "BUY") {
    await sendMessage(chatId,
`🔥 Produk Premium

💰 Harga: RM10
📥 Dapat terus selepas bayar

👉 Bayar sini:
https://your-payment-link.com`
    );
  }

  // INFO
  else if (text === "INFO") {
    await sendMessage(chatId,
`📌 Info Produk:
- Digital product
- Instant delivery
- Support 24 jam`
    );
  }

  // DEFAULT
  else {
    await sendMessage(chatId,
`❓ Command tak dikenali

Taip:
BUY
INFO`
    );
  }

  res.sendStatus(200);
});

// ===== SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server ON");
});
