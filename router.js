// router.js — Rahl Quantum Bot Royal Backend

const express = require("express");
const { makeid } = require("./gen-id");
const { create } = require("venom-bot");
const router = express.Router();
const sessions = {};

router.get("/pair", async (req, res) => {
  const number = req.query.number;
  console.log(`📥 Request received for number: ${number}`);

  if (!number || number.length < 10) {
    return res.status(400).json({ error: "Invalid number" });
  }

  const sessionId = makeid(5);

  if (sessions[number]) {
    return res.json({
      status: "active",
      message: "Session already exists for this number.",
    });
  }

  try {
    const client = await create({
      session: sessionId,
      multidevice: true,
      headless: true,
      browserArgs: ["--no-sandbox"],
    });

    sessions[number] = client;

    let responded = false;

    client.onStateChange(async (state) => {
      console.log(`📡 State changed for ${number}: ${state}`);

      if (state === "PAIRING" && !responded) {
        responded = true;
        try {
          const code = await client.getPairingCode();
          console.log(`🔑 Pairing code for ${number}: ${code}`);
          res.json({
            status: "pending",
            pairingCode: code,
            message: "Use this code in WhatsApp: Settings > Linked Devices",
          });
        } catch (err) {
          console.error("❌ Error getting pairing code:", err);
          res.status(500).json({ error: "Failed to generate code", detail: err.message });
        }
      }
    });

    // 🧠 Royal Command Center
    client.onMessage(async (message) => {
      const from = message.from;
      const body = message.body?.trim().toLowerCase();

      if (!body) return;

      if (body === ".ping") {
        await client.sendText(from, "🔱 Royal Response: *Pong!*");
      } else if (body === ".alive") {
        await client.sendText(
          from,
          `👑 *Rahl Quantum Bot is Alive!*\n\n⚡ Powered by *Venom*\n🧠 Intelligence of *Lord Rahl*\n🔰 Status: Royal & Operational`
        );
      } else if (body === ".menu") {
        await client.sendText(
          from,
          `🔱 *Rahl Quantum Royal Menu* 🔱

1. .alive — Bot status ⚙️
2. .ping — Check response 🛰️
3. .menu — This majestic menu 🗂️
4. .help — Royal assistance 🤝
5. .rules — House rules 📜
6. .creator — Who made me 👑
7. .source — GitHub scrolls 🧾
8. .groupinfo — Info of the court 🏛️
9. .linkgroup — Invite others 🔗
10. .admins — Show noble guards 🛡️
11. .blocklist — Enemies list 🚫
12. .promote @user — Rise to knighthood 🏇
13. .demote @user — Strip rank ❌
14. .welcome on/off — Welcome greetings 💌
15. .goodbye on/off — Farewell messages 👋
16. .antilink on/off — Anti-spam 🧱
17. .kick @user — Banish traitor ⚔️
18. .tagall — Royal summon 📣
19. .sticker — Make royal sticker 🎴
20. .quoteimage — Quote to image 🖼️
21. .weather [city] — Forecast ☁️
22. .time — Royal time 🕰️
23. .meme — Random meme 😂
24. .joke — Make thee laugh 😄
25. .fact — Royal fact 📘
26. .translate [text] — Language change 🌍
27. .gpt [prompt] — AI wisdom 🤖
28. .tts [text] — Royal speech 🎙️
29. .calc [expression] — Calculator 🧮
30. .news — Headlines 📢
31. .covid — Covid stats 🦠
32. .quote — Random quote 📚
33. .lyrics [song] — Song lyrics 🎶
34. .ytmp3 [link] — YouTube to MP3 🎧
35. .ytmp4 [link] — YouTube to MP4 📹
36. .igdl [link] — Insta download 📸
37. .fb [link] — Facebook video 📱
38. .tiktok [link] — TikTok fetch 🎵
39. .apk [name] — Find APK 📦
40. .shorten [url] — Shorten links 🔗
41. .whois [domain] — Domain info 🌐
42. .qrcode [text] — Make QR 🔳
43. .wiki [topic] — Royal knowledge 📖
44. .anime [name] — Anime info 🌸
45. .crypto — Crypto stats 💰
46. .nasa — Space image 🚀
47. .cat — Royal cat 🐱
48. .dog — Loyal dog 🐶
49. .bird — Flying friend 🐦
50. .about — About me 🧠

⚜️ 𝑷𝒐𝒘𝒆𝒓 𝑻𝒉𝒓𝒐𝒖𝒈𝒉 𝑲𝒏𝒐𝒘𝒍𝒆𝒅𝒈𝒆 — 𝑪𝒐𝒏𝒕𝒓𝒐𝒍 𝑻𝒉𝒓𝒐𝒖𝒈𝒉 𝑪𝒐𝒅𝒆 ⚜️`
        );
      }
    });

    // 🕐 Timeout fallback
    setTimeout(() => {
      if (!responded) {
        responded = true;
        res.status(408).json({ error: "Timeout: Did not reach pairing state" });
      }
    }, 15000);
  } catch (err) {
    console.error("❌ Failed to initialize session:", err);
    res.status(500).json({ error: "Session failed", detail: err.message });
  }
});

module.exports = router;
