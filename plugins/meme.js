// plugins/meme.js — 🤡 Royal Meme Distributor
const axios = require("axios");

module.exports = async function memePlugin(client, message) {
  try {
    const res = await axios.get("https://meme-api.com/gimme");
    const meme = res.data;

    await client.sendImage(
      message.from,
      meme.url,
      "royal-meme.jpg",
      `🎭 *Royal Humor Incoming!*\n\n👑 Title: ${meme.title}\n🏛️ Source: ${meme.subreddit}\n\n💬 Brought to you by Rahl Intelligence`
    );
  } catch (err) {
    console.error("❌ Meme Error:", err.message);
    await client.sendText(
      message.from,
      "⚠️ Royal scroll of humor failed to arrive. Please try again later."
    );
  }
};
