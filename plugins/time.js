// plugins/time.js — ⏳ Royal Time Teller
module.exports = async function timePlugin(client, message) {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const timeString = `🕰️ *Royal Clock:*\n\n🧭 Time Now: *${hours}:${minutes}:${seconds}*`;

  await client.sendText(message.from, timeString);
};
