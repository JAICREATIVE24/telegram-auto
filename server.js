app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook masuk:", JSON.stringify(req.body));

    const msg = req.body.message;

    if (!msg) return res.send("OK");

    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "👋 Selamat datang ke bot Auto Delivery!",
      });
    } 
    else if (text && text.toLowerCase().includes("payment")) {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "🔥 Payment berjaya diterima!",
      });
    } 
    else {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "🤖 Message: " + text,
      });
    }

    res.send("OK");
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.send("ERROR");
  }
});
