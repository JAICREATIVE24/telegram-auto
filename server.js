const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ==============================
// 🔑 CONFIG
// ==============================
const BOT_TOKEN = "8533943288:AAGE-gd4pwTeI0jdVgHzDvkC7cv0qz7V2Hs";
const WEBHOOK_URL = "https://telegram-auto-1-iaxi.onrender.com/webhook";

// simpan code yang dah digunakan
let usedCodes = new Set();

// ==============================
// 📤 SEND MESSAGE
// ==============================
async function sendMessage(chatId, text) {
  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: chatId,
    text: text,
  });
}

// ==============================
// 📥 WEBHOOK
// ==============================
app.post("/webhook", async (req, res) => {
  try {
    const update = req.body;

    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;

      console.log("MESSAGE:", text);

      // extract code
      const parts = text.split(" ");
      const code = parts[1]; // contoh: ABC123

      if (text.toUpperCase().includes("PAID") && code) {

        // ❌ kalau dah pernah guna
        if (usedCodes.has(code)) {
          await sendMessage(chatId, "⚠️ Code sudah digunakan");
          return res.sendStatus(200);
        }

        // ✅ simpan code
        usedCodes.add(code);

        await sendMessage(
          chatId,
          "✅ PAYMENT BERJAYA\n🎁 Produk: https://linkanda.com"
        );
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.sendStatus(500);
  }
});

// ==============================
// 🌐 SET WEBHOOK
// ==============================
app.get("/setwebhook", async (req, res) => {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`;
  await axios.get(url);
  res.send("Webhook set!");
});

// ==============================
app.get("/", (req, res) => {
  res.send("AUTO DELIVERY FINAL 🔥");
});

app.listen(3000, () => {
  console.log("SERVER RUNNING");
});
