// plugins/date.js — 📜 Royal Calendar Scroll
module.exports = async function datePlugin(client, message) {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();

  const fullDate = `📜 *Royal Calendar:*\n\n📅 Today is *${day}/${month}/${year}*`;

  await client.sendText(message.from, fullDate);
};
