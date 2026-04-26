const express = require("express");
const axios = require("axios");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ENV
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Check ENV
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
  } catch (err) {
    console.log("Error hantar Telegram:", err.message);
  }
}

// Webhook
app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.message;

    if (!msg) return res.send("OK");

    const text = msg.text;

    console.log("Message:", text);

    if (text === "/start") {
      await sendTelegram("👋 Selamat datang ke bot Auto Delivery!");
    } 
    else if (text.toLowerCase().includes("payment")) {
      await sendTelegram("🔥 Payment berjaya diterima!");
    } 
    else {
      await sendTelegram("🤖 Message diterima: " + text);
    }

    res.send("OK");
  } catch (err) {
    console.log("Error:", err.message);
    res.send("ERROR");
  }
});

// Test server
app.get("/", (req, res) => {
  res.send("Server hidup 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server ON");
});
