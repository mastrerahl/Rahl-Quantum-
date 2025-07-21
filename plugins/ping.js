const { performance } = require("perf_hooks");

module.exports = async function pingPlugin(client, message) {
  const start = performance.now();
  const pong = await client.sendText(message.from, "🔱 Royal Ping... Checking...");
  const end = performance.now();
  const speed = (end - start).toFixed(2);

  await client.sendText(message.from, `
⚜️ *RAHL QUANTUM STATUS*

🔰 *Latency*: ${speed}ms  
⚙️ *Server*: Royal Node.js Engine  
📦 *Power Core*: Venom Quantum  

🔐 Realm Stable.  
🎯 Ready to Execute Commands.
`);
};
