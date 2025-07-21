// plugins/quote.js — 📜 Wisdom from the Royal Scrolls
module.exports = async function quotePlugin(client, message) {
  const scrolls = [
    "🔱 *'True power lies not in fear, but in respect.'* — Lord Rahl",
    "👑 *'He who controls the code, commands the kingdom.'*",
    "💠 *'Royalty is not a crown, it is a calling.'*",
    "📖 *'A single line of truth is mightier than armies of deception.'*",
    "🗡 *'To lead is to serve with unwavering wisdom.'*",
    "🔥 *'Rahl commands. The world obeys.'*",
    "🌌 *'Even in shadows, the crown shines brightest.'*",
    "🦁 *'Speak like a lion, act like a legend.'*",
    "🧠 *'Code with clarity, rule with conscience.'*",
    "🪄 *'What is seen can be untrue; what is coded becomes real.'*"
  ];

  const selected = scrolls[Math.floor(Math.random() * scrolls.length)];

  await client.sendText(message.from, `📜 *Royal Scroll Quote:*\n\n${selected}`);
};
