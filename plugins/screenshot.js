// plugins/screenshot.js — 👑 Royal Web Screenshot
const axios = require("axios");

module.exports = async function screenshotPlugin(client, message) {
  const prefix = ".ss";
  const url = message.body.slice(prefix.length).trim();

  if (!url || !url.startsWith("http")) {
    return client.sendText(
      message.from,
      "❗ *Royal Notice:*\nPlease provide a valid URL.\nExample: `.ss https://example.com`"
    );
  }

  try {
    const apiUrl = `https://image.thum.io/get/fullpage/${url}`;
    await client.sendImage(
      message.from,
      apiUrl,
      "screenshot.jpg",
      `📸 *Royal Screenshot Captured by Rahl Quantum*`
    );
  } catch (error) {
    console.error("❌ Screenshot Error:", error.message);
    client.sendText(
      message.from,
      "⚠️ *Rahl Alert: Failed to fetch screenshot.*\nThe scroll of vision could not open that realm."
    );
  }
};
