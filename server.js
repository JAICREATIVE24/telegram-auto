const express = require("express");
const axios = require("axios");

const app = express();

// ==============================
// 🔑 CONFIG
// ==============================
const BOT_TOKEN = "8533943288:AAGE-gd4pwTeI0jdVgHzDvkC7cv0qz7V2Hs";
const CHECK_INTERVAL = 5000;

let lastUpdateId = 0;
let processedMessages = new Set();
let isChecking = false; // 🔥 lock elak double loop

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
// 🔍 CHECK UPDATE
// ==============================
async function checkUpdates() {
  if (isChecking) return; // 🔥 elak overlap
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
        const msgId = update.message.message_id;

        // 🔥 skip kalau dah proses
        if (processedMessages.has(msgId)) continue;
        processedMessages.add(msgId);

        console.log("MESSAGE:", text);

        // 🔥 TRIGGER
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
// 🔁 LOOP SAFE
// ==============================
setInterval(checkUpdates, CHECK_INTERVAL);

// ==============================
// 🌐 SERVER
// ==============================
app.get("/", (req, res) => {
  res.send("AUTO DELIVERY STABLE ✅");
});

app.listen(3000, () => {
  console.log("SERVER RUNNING");
});
