const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ==============================
// 🔑 CONFIG
// ==============================
const BOT_TOKEN = "8533943288:AAE-9q4uhnOykClKh74m4NStD1wHBctTsj0"; // ganti token bot
const CHECK_INTERVAL = 5000; // 5 saat

let lastUpdateId = 0;

// ==============================
// 📤 FUNCTION HANTAR TELEGRAM
// ==============================
async function sendMessage(chatId, text) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
  } catch (err) {
    console.log("Send error:", err.message);
  }
}

// ==============================
// 🔍 CHECK TELEGRAM MESSAGE
// ==============================
async function checkUpdates() {
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

        console.log("MESSAGE MASUK:", text);

        // ==============================
        // 🔥 TRIGGER PAYMENT
        // ==============================
        if (text.toUpperCase().includes("PAID")) {
          console.log("PAYMENT DETECTED!");

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
// 🌐 SERVER TEST
// ==============================
app.get("/", (req, res) => {
  res.send("Telegram Auto Detect ON 🔥");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
