// plugins/crown.js — 👑 Royal Identity Echo
module.exports = async function crownPlugin(client, message) {
  const senderName = message.notifyName || "Noble One";
  const senderNumber = message.sender.split("@")[0];
  const chatType = message.isGroupMsg ? "👥 Group Chat" : "🤴 Private Chat";

  const reply = `
🔱 *Royal Identity Scroll* 🔱

👑 Name: *${senderName}*
📞 Number: *+${senderNumber}*
🏰 Chat Type: ${chatType}

📝 Summoned by the Crown of Rahl.
`;

  await client.sendText(message.from, reply);
};
