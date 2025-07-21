// 👑 Rahl Quantum Bot - index.js
const venom = require('venom-bot');

// ⚔️ Royal Plugins
const menuPlugin = require('./plugins/menu');
const vvPlugin = require('./plugins/vv');
const vv2Plugin = require('./plugins/vv2');
const playPlugin = require('./plugins/play');
const videoPlugin = require('./plugins/video');
const moviePlugin = require('./plugins/movie');
const quotePlugin = require('./plugins/quote');
const weatherPlugin = require('./plugins/weather');
const advicePlugin = require('./plugins/advice');
const antideletePlugin = require('./plugins/antidelete');

venom
  .create({
    session: 'rahl-quantum',
    multidevice: true,
    headless: true,
    useChrome: false,
    disableWelcome: true,
  })
  .then(async (client) => {
    console.log("👑 Rahl Quantum is now online!");

    // 💬 Message Handler
    client.onMessage(async (message) => {
      if (!message.body || !message.from) return;

      const prefix = '.';
      const args = message.body.trim().split(/ +/);
      const command = args[0].toLowerCase();
      const query = args.slice(1).join(" ");

      // 🧭 Royal Commands
      if (command === '.menu') return menuPlugin(client, message);
      if (command === '.vv') return vvPlugin(client, message);
      if (command === '.vv2') return vv2Plugin(client, message);
      if (command === '.play') return playPlugin(client, message, query);
      if (command === '.video') return videoPlugin(client, message, query);
      if (command === '.movie') return moviePlugin(client, message, query);
      if (command === '.quote') return quotePlugin(client, message);
      if (command === '.weather') return weatherPlugin(client, message, query);
      if (command === '.advice') return advicePlugin(client, message);
    });

    // 🕊️ Antidelete Handler
    client.onDeletedMessage((msg) => {
      antideletePlugin(client, msg);
    });
  })
  .catch((err) => {
    console.error("❌ Royal Error:", err);
  });
