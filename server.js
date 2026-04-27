const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ================= CONFIG =================
const BOT_TOKEN = "8533943288:AAE-9q4uhnOykClKh74m4NStD1wHBctTsj0";
const CHAT_ID = "-1003912762823";
const SECRET_KEY = "wswd4co3-c7q6-g3j7-x8li-818np1tksbq";

// ================= TELEGRAM =================
async function sendTelegram(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log("Telegram sent");
  } catch (err) {
    console.log("Telegram error:", err.message);
  }
}

// ================= CHECK PAYMENT =================
async function checkPayment(billCode) {
  try {
    const res = await axios.post(
      "https://toyyibpay.com/index.php/api/getBillTransactions",
      new URLSearchParams({
        userSecretKey: SECRET_KEY,
        billCode: billCode,
      })
    );

    if (res.data[0] && res.data[0].billpaymentStatus === "1") {
      return true;
    }

    return false;
  } catch (err) {
    console.log("ToyyibPay error:", err.message);
    return false;
  }
}

// ================= AUTO TRACK =================
let bills = {};

// check setiap 10 saat
setInterval(async () => {
  for (let code in bills) {
    const paid = await checkPayment(code);

    if (paid && !bills[code]) {
      await sendTelegram(`🔥 PAYMENT BERJAYA\nBill: ${code}`);
      bills[code] = true;
    }
  }
}, 10000);

// ================= ROUTES =================

// ROOT FIX (ini penting)
app.get("/", (req, res) => {
  res.send("Server running...");
});

// TEST TELEGRAM
app.get("/test", async (req, res) => {
  await sendTelegram("🔥 TEST TELEGRAM BERJAYA");
  res.send("Telegram OK");
});

// ADD BILL TRACKING
app.get("/add/:billCode", (req, res) => {
  const code = req.params.billCode;
  bills[code] = false;
  res.send("Tracking bill: " + code);
});

// MANUAL CHECK
app.get("/check/:billCode", async (req, res) => {
  const code = req.params.billCode;
  const paid = await checkPayment(code);

  if (paid) {
    await sendTelegram(`✅ Payment berjaya untuk ${code}`);
    return res.send("PAID");
  }

  res.send("NOT PAID");
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
