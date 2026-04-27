const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ==============================
// 🔑 CONFIG
// ==============================
const BOT_TOKEN = "8533943288:AAGE-gd4pwTeI0jdVgHzDvkC7cv0qz7V2Hs";
const WEBHOOK_URL = "https://telegram-auto-1-iaxi.onrender.com/webhook";

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
// 📥 TELEGRAM WEBHOOK
// ==============================
app.post("/webhook", async (req, res) => {
  try {
    const update = req.body;

    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;

      console.log("MESSAGE:", text);

      if (text.toUpperCase().includes("PAID")) {
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
// 🌐 SET WEBHOOK AUTO
// ==============================
app.get("/setwebhook", async (req, res) => {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`;
    await axios.get(url);
    res.send("Webhook set!");
  } catch (err) {
    res.send("Error set webhook");
  }
});

// ==============================
// 🌐 SERVER
// ==============================
app.get("/", (req, res) => {
  res.send("WEBHOOK AUTO DELIVERY 🔥");
});

app.listen(3000, () => {
  console.log("SERVER RUNNING WEBHOOK MODE");
});
