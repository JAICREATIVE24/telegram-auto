const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegram(text) {
  await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: text
  });
}

app.post("/webhook", async (req, res) => {
  console.log("Webhook masuk:", req.body);

  await sendTelegram("🔥 Payment masuk!");

  res.send("OK");
});

app.get("/", (req, res) => {
  res.send("Server hidup 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server ON");
});
