const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ==============================
// 🔑 CONFIG
// ==============================
const BOT_TOKEN = "8533943288:AAGE-gd4pwTeI0jdVgHzDvkC7cv0qz7V2Hs"; // WAJIB ganti
const CHECK_INTERVAL = 5000;

// simpan update terakhir
let lastUpdateId = 0;

// elak duplicate
let processedMessages = new Set();

// ==============================
// 📤 SEND TELEGRAM
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
// 🔍 CHECK TELEGRAM
// ==============================
async function checkUpdates() {
  try {
    const res = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`,
      {
        params: {
          offset: lastUpdateId + 1,
          timeout: 10,
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

        // skip kalau dah pernah proses
        if (processedMessages.has(msgId)) continue;
        processedMessages.add(msgId);

        console.log("MESSAGE:", text);

        // ==============================
        // 🔥 TRIGGER PAYMENT
        // ==============================
        if (text.toUpperCase().includes("PAID")) {
          console.log("PAYMENT DETECTED");

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
}

// ==============================
// 🔁 LOOP
// ==============================
setInterval(checkUpdates, CHECK_INTERVAL);

// ==============================
// 🌐 SERVER
// ==============================
app.get("/", (req, res) => {
  res.send("AUTO DELIVERY RUNNING 🔥");
});

app.listen(3000, () => {
  console.log("SERVER ON PORT 3000");
});
