const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// =========================
// CONFIG
// =========================
const BOT_TOKEN = "TOKEN_TELEGRAM_KAU";
const CHAT_ID = "CHAT_ID_KAU";

// =========================
// FUNCTION TELEGRAM
// =========================
async function sendTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML"
    });
    console.log("✅ Message sent to Telegram");
  } catch (err) {
    console.log("❌ Telegram error:", err.response?.data || err.message);
  }
}

// =========================
// TOYYIBPAY CALLBACK
// =========================
app.post("/callback", async (req, res) => {
  try {
    const data = req.body;

    console.log("📥 Callback masuk:", data);

    // Check payment status
    if (data.status === "1") {
      const customerName = data.billName || "Customer";
      const amount = data.billAmount || "0";

      const message = `
🔥 PAYMENT BERJAYA

👤 Nama: ${customerName}
💰 Amount: RM${amount}

✅ Produk:
Link download: https://link-produk-kau.com
      `;

      await sendTelegram(message);
    }

    res.send("OK");
  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

// =========================
// START SERVER
// =========================
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
