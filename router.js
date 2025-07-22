// router.js — Rahl Quantum Bot using Baileys

const express = require("express");
const { makeid } = require("./gen-id");
const fs = require("fs");
const path = require("path");
const pino = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  delay,
  Browsers,
} = require("@whiskeysockets/baileys");

const router = express.Router();

router.get("/pair", async (req, res) => {
  const number = req.query.number?.replace(/[^0-9]/g, "");

  if (!number || number.length < 10) {
    return res.status(400).json({ error: "❌ Invalid phone number" });
  }

  const sessionId = makeid(5);
  const sessionDir = path.join(__dirname, "temp", sessionId);

  // ✅ Ensure the session directory exists
  fs.mkdirSync(sessionDir, { recursive: true });

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
      },
      printQRInTerminal: false,
      browser: Browsers.macOS("Rahl Quantum Royal"),
      logger: pino({ level: "silent" }),
    });

    sock.ev.on("creds.update", saveCreds);

    // ✅ Generate Pair Code if not registered
    if (!sock.authState.creds.registered) {
      await delay(1000); // slight delay before requesting

      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Royal Code for ${number}: ${code}`);

      return res.json({
        status: "pending",
        pairingCode: code,
        message: "Paste this in WhatsApp: Settings → Linked Devices → Link",
      });
    }

    // Already registered
    return res.status(409).json({
      error: "Already logged in",
    });
  } catch (err) {
    console.error("❌ Pairing error:", err);
    return res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown",
    });
  }
});

module.exports = router;
