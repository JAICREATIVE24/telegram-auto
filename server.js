const express = require("express");
const axios = require("axios");

const app = express();

// ==============================
// 🔑 CONFIG
// ==============================
const BOT_TOKEN = "8533943288:AAGE-gd4pwTeI0jdVgHzDvkC7cv0qz7V2Hs";
const CHECK_INTERVAL = 5000;

let lastUpdateId = 0;
let isChecking = false;

// ==============================
// 📤 SEND MESSAGE
// ==============================
async function sendMessage(chatId, text) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
  } catch (err) {
    console.log("SEND ERROR:", err.message);
  }
}

// ==============================
// 🔥 INIT (BUANG OLD MESSAGE)
// ==============================
async function init() {
  try {
    const res = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`
    );

    const updates = res.data.result;

    if (updates.length > 0) {
      lastUpdateId = updates[updates.length - 1].update_id;
    }

    console.log("INIT DONE - OLD MESSAGE CLEARED");
  } catch (err) {
    console.log("INIT ERROR:", err.message);
  }
}

// ==============================
// 🔍 CHECK UPDATE
// ==============================
async function checkUpdates() {
  if (isChecking) return;
  isChecking = true;

  try {
    const res = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`,
      {
        params: {
          offset: lastUpdateId + 1,
        },
      }
    );

    const updates = res.data.result;

    for (let update of updates) {
      lastUpdateId = update.update_id;

      if (update.message && update.message.text) {
        const text = update.message.text;
        const chatId = update.message.chat.id;

        console.log("NEW MESSAGE:", text);

        if (text.toUpperCase().includes("PAID")) {
          await sendMessage(
            chatId,
            "✅ PAYMENT BERJAYA\n🎁 Produk: https://linkanda.com"
          );
        }
      }
    }
  } catch (err) {
    console.log("ERROR:", err.message);
  }

  isChecking = false;
}

// ==============================
// 🚀 START SYSTEM
// ==============================
init();
setInterval(checkUpdates, CHECK_INTERVAL);

// ==============================
// 🌐 SERVER
// ==============================
app.get("/", (req, res) => {
  res.send("AUTO DELIVERY FINAL 🔥");
});

app.listen(3000, () => {
  console.log("SERVER RUNNING");
});
