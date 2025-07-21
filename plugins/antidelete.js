// plugins/antidelete.js — 👑 Rahl Quantum Royal Anti-Delete
module.exports = async function antiDeletePlugin(client, deletedMsg) {
  if (!deletedMsg || !deletedMsg.body || !deletedMsg.from) return;

  const time = new Date().toLocaleTimeString();
  const date = new Date().toLocaleDateString();

  const senderId = deletedMsg.sender?.pushname || deletedMsg.participant || "Unknown";
  const deletedText = deletedMsg.body || "Media message";

  const reply = `
🔱 *𝗥𝗢𝗬𝗔𝗟 𝗔𝗡𝗧𝗜-𝗗𝗘𝗟𝗘𝗧𝗘 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗*

🕰️ *Time:* ${time}
📅 *Date:* ${date}

💬 *Deleted Message:*
${deletedText}

🧛 *Deleted By:* ${senderId}

⚡ *Powered by Rahl Quantum – Royal Intelligence*
  `.trim();

  await client.sendText(deletedMsg.from, reply);
};
