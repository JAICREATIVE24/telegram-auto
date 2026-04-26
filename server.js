const express = require("express");
const axios = require("axios");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ENV
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.log("❌ BOT_TOKEN belum set!");
}

// ===============================
// FUNCTION HANTAR TELEGRAM
// ===============================
async function sendTelegram(chatId, text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const res = await axios.post(url, {
      chat_id: chatId,
      text: text,
    });

    console.log("✅ Hantar berjaya:", res.data.result?.text);
  } catch (err) {
    console.log("❌ Error hantar:", err.response?.data || err.message);
  }
}

// ===============================
// WEBHOOK TELEGRAM
// ===============================
app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.message;

    if (!msg) return res.send("OK");

    // 🚫 STOP LOOP (BOT JANGAN REPLY DIRI SENDIRI)
    if (msg.from.is_bot) return res.send("OK");

    const chatId = msg.chat.id;
    const text = msg.text;

    console.log("📩 Message user:", text);

    // ===============================
    // COMMAND START
    // ===============================
    if (text === "/start") {
      await sendTelegram(chatId, "👋 Selamat datang ke bot Auto Delivery!");
    }

    // ===============================
    // PAYMENT TRIGGER (SIMULASI)
    // ===============================
    else if (text && text.toLowerCase() === "payment") {
      await sendTelegram(chatId, "🔥 Payment berjaya diterima!");
    }

    // ===============================
    // OPTIONAL (DEBUG OFF)
    // ===============================
    // else {
    //   await sendTelegram(chatId, "🤖 Message diterima: " + text);
    // }

    res.send("OK");
  } catch (err) {
    console.log("❌ ERROR:", err.response?.data || err.message);
    res.send("ERROR");
  }
});

// ===============================
// ROOT TEST
// ===============================
app.get("/", (req, res) => {
  res.send("Server hidup 🚀");
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server ON port " + PORT);
});
