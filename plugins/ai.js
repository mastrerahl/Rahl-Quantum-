// plugins/ai.js — 👑 Ask the Royal Oracle
const axios = require("axios");

const OPENAI_API_KEY = "your-openai-api-key"; // 🔐 Replace with your own key

module.exports = async function aiPlugin(client, message) {
  const prefix = ".ai";
  const prompt = message.body.slice(prefix.length).trim();

  if (!prompt) {
    return client.sendText(
      message.from,
      "📜 *Royal Protocol:*\nAsk a question after `.ai`\nExample: `.ai What is quantum computing?`"
    );
  }

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const royalResponse = res.data.choices[0].message.content.trim();
    await client.sendText(message.from, `🤖 *Rahl Oracle Says:*\n${royalResponse}`);
  } catch (err) {
    console.error("❌ AI Error:", err.message);
    client.sendText(
      message.from,
      "⚠️ *Royal Alert:*\nUnable to reach the oracle. Try again later."
    );
  }
};
