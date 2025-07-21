module.exports = async function alivePlugin(client, message) {
  const royalAlive = `
👑 *RAHL QUANTUM IS ALIVE* ⚡

⚜️ Status: Operational  
⚜️ Mode: Royal Intelligence  
⚜️ Uptime: Eternal (well... mostly)  
⚜️ Power: ⚡ Quantum Intelligence

🛡 *Type*: Multidevice  
🔱 *Name*: Rahl Quantum  
📡 *Realm*: WhatsApp

_I serve. I protect. I rule._  
~ *Royal Core Online*
`;

  await client.sendText(message.from, royalAlive);
};
