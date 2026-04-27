const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "8533943288:AAE-9q4uhnOykClKh74m4NStD1wHBctTsj0";
const CHAT_ID = "-1003912762823";

// 👉 TOYYIBPAY USER SECRET 
const USER_SECRET = "wswd4co3-c7q6-g3j7-x8li-818np1tksbq";

// SIMPAN BILL YANG NAK CHECK
let billCodes = [];

// HANTAR TELEGRAM
async function sendTelegram(msg) {
  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: msg,
  });
}

// ADD BILL UNTUK TRACK
app.get("/add/:billcode", (req, res) => {
  const bill = req.params.billcode;
  billCodes.push(bill);
  res.send(`Tracking bill: ${bill}`);
});

// CHECK PAYMENT LOOP
setInterval(async () => {
  if (billCodes.length === 0) return;

  for (let bill of billCodes) {
    try {
      const res = await axios.post(
        "https://toyyibpay.com/index.php/api/getBillTransactions",
        new URLSearchParams({
          userSecretKey: USER_SECRET,
          billCode: bill,
        })
      );

      const data = res.data;

      if (data && data[0] && data[0].billpaymentStatus === "1") {
        // SUCCESS

        await sendTelegram(`✅ PAYMENT SUCCESS\nBill: ${bill}`);

        // AUTO DELIVERY
        await sendTelegram("🎁 Produk: https://linkanda.com");

        // BUANG DARI LIST
        billCodes = billCodes.filter((b) => b !== bill);
      }
    } catch (err) {
      console.log("Error check:", err.message);
    }
  }
}, 10000); // check setiap 10 saat

app.get("/", (req, res) => {
  res.send("Server ON 🔥");
});

app.listen(3000, () => console.log("Server running"));
