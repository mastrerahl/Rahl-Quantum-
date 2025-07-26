// router.js — Lord Rahl Session Generator + DM Delivery
const express = require("express");
const { makeid } = require("./gen-id");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  delay,
  Browsers,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/pair", async (req, res) => {
  const number = req.query.number?.replace(/[^0-9]/g, "");
  if (!number || number.length < 10) {
    return res.status(400).json({ error: "Invalid number" });
  }

  const sessionId = makeid(5); // e.g. "XyZ12"
  const sessionDir = path.join(__dirname, "session", sessionId);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  try {
    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
      },
      printQRInTerminal: false,
      browser: Browsers.ubuntu("Chrome"),
      logger: pino({ level: "silent" }),
    });

    sock.ev.on("creds.update", saveCreds);

    // 🔁 Listen for connection status
    sock.ev.on("connection.update", async (update) => {
      if (update.connection === "open") {
        const sessionData = {
          creds: state.creds,
          keys: state.keys,
        };

        const sessionString = Buffer.from(JSON.stringify(sessionData)).toString("base64");
        const finalSession = `LORD-RAHL~${sessionId}#${sessionString}`;

        // 💾 Save to file
        const sessionFilePath = path.join(__dirname, "session", `${sessionId}.txt`);
        fs.writeFileSync(sessionFilePath, finalSession);

        // 📲 Send to WhatsApp DM
        const jid = `${number}@s.whatsapp.net`;
        await sock.sendMessage(jid, {
          text: `🔐 *Your LORD-RAHL Session*\n\n${finalSession}\n\nPaste it into your bot.`,
        });

        console.log("✅ Session sent to WhatsApp.");
      }
    });

    // 🧪 Generate pairing code
    if (!sock.authState.creds.registered) {
      await delay(1500);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code for ${number}: ${code}`);

      return res.json({
        status: "pending",
        pairingCode: code,
        message: "Use this code in WhatsApp: Settings > Linked Devices",
      });
    } else {
      return res.status(409).json({ error: "Already linked" });
    }

  } catch (err) {
    console.error("❌ Error during session generation:", err);
    res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown error",
    });
  }
});

module.exports = router;
