// router.js — Rahl Quantum with Debug Logs 👑

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
  console.log(`📥 Royal Request received for number: ${number || "undefined"}`);

  if (!number || number.length < 10) {
    console.warn("⚠️ Invalid or missing number format.");
    return res.status(400).json({ error: "Invalid number format. Use format like 2547XXXXXXXX" });
  }

  const sessionId = makeid(5);
  const sessionDir = path.join(__dirname, "temp", sessionId);
  console.log(`📂 Creating royal session folder: ${sessionDir}`);

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
      },
      printQRInTerminal: false,
      browser: Browsers.macOS("Rahl Quantum"),
      logger: pino({ level: "silent" }),
    });

    sock.ev.on("creds.update", saveCreds);

    // Only send pairing code if not already registered
    if (!sock.authState.creds.registered) {
      await delay(1500);
      console.log(`🧠 Not registered yet. Requesting code for ${number}...`);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code for ${number}: ${code}`);

      return res.json({
        status: "pending",
        pairingCode: code,
        message: "Use this code in WhatsApp: Settings > Linked Devices",
      });
    } else {
      console.log(`⚠️ ${number} is already logged in.`);
      return res.status(409).json({ error: "Already logged in." });
    }
  } catch (err) {
    console.error("❌ Royal Error during pairing:", err.message);
    return res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown error",
    });
  }
});

module.exports = router;
