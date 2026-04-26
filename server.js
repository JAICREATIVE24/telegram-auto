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
  try {
    const message = req.body.message;
    if (!message) return res.sendStatus(200);

    const chatId = message.chat.id;

    // 🔥 FIX: case insensitive + elak undefined
    const text = (message.text || "").toLowerCase().trim();

    console.log("📩 Message user:", text);

    // ===== COMMAND SYSTEM =====

    // START
    if (text === "/start") {
      await sendMessage(chatId,
`👋 Selamat datang ke AUTO DELIVERY SYSTEM

🛒 Taip command:
BUY - untuk beli produk
INFO - untuk info produk`
      );
    }

    // BUY
    else if (text === "buy") {
      await sendMessage(chatId,
`🔥 PRODUK PREMIUM

💰 Harga: RM10
📥 Delivery: Instant

👉 Bayar sini:
https://your-payment-link.com`
      );
    }

    // INFO
    else if (text === "info") {
      await sendMessage(chatId,
`📌 INFO PRODUK

✔ Digital product
✔ Instant delivery
✔ Support 24 jam`
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
  } catch (error) {
    console.log("❌ Webhook Error:", error.message);
    res.sendStatus(500);
  }
});

// ===== ROOT TEST (OPTIONAL) =====
app.get("/", (req, res) => {
  res.send("🚀 Telegram Auto Delivery Bot Running");
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server ON port " + PORT);
});
