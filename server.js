const express = require("express");
const axios = require("axios");

const app = express();

const BOT_TOKEN = "8533943288:AAE-9q4uhnOykClKh74m4NStD1wHBctTsj0"; // isi token betul

let lastUpdateId = 0;

// CHECK MESSAGE TELEGRAM
setInterval(async () => {
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
        console.log("MESSAGE MASUK:", update.message.text);
      }
    }
  } catch (err) {
    console.log("ERROR:", err.message);
  }
}, 5000);

app.get("/", (req, res) => {
  res.send("Bot running 🔥");
});

app.listen(3000, () => console.log("Server ON"));
