// router.js — Lord Rahl Session Generator
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

  const sessionId = makeid(5); // e.g. "H1zGp"
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

    sock.ev.on("connection.update", async (update) => {
      if (update.connection === "open") {
        // ✅ Session created successfully
        const sessionData = {
          creds: state.creds,
          keys: state.keys,
        };

        // 📦 Convert session to base64 string
        const sessionString = Buffer.from(JSON.stringify(sessionData)).toString("base64");

        // 📛 Format session as LORD-RAHL style
        const finalSession = `LORD-RAHL~${sessionId}#${sessionString}`;

        // 💾 Save session to file (optional)
        const sessionFilePath = path.join(__dirname, "session", `${sessionId}.txt`);
        fs.writeFileSync(sessionFilePath, finalSession);

        console.log("✅ LORD-RAHL session created.");
        return res.json({
          status: "connected",
          session: finalSession,
          message: "Paste this session to your bot env",
        });
      }
    });

    // 🔐 Request pairing code
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
    console.error("❌ Failed to pair:", err);
    res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown",
    });
  }
});

module.exports = router;
