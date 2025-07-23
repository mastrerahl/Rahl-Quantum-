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
// const { Boom } = require("@hapi/boom"); // Optional

const router = express.Router();

router.get("/pair", async (req, res) => {
  const number = req.query.number?.replace(/[^0-9]/g, "");
  if (!number || number.length < 10) {
    return res.status(400).json({ error: "Invalid number" });
  }

  const sessionId = makeid(5);
  const sessionDir = path.join(__dirname, "session", sessionId);

  // ✅ Ensure the session directory exists
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  try {
    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
      },
      printQRInTerminal: false,
      browser: Browsers.ubuntu("Chrome"), // ✅ Recommended
      logger: pino({ level: "silent" }),
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
      await delay(1500);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code for ${number}: ${code}`);

      // ✅ Send response to frontend
      res.json({
        status: "pending",
        pairingCode: code,
        message: "Use this code in WhatsApp: Settings > Linked Devices",
      });

      // ✅ Keep socket alive for 30 seconds to allow linking
      await delay(30000);
      console.log("⏹ Done waiting. You can close the socket if needed.");
      return;
    } else {
      res.status(409).json({ error: "Already linked" });
    }

    // ✅ Optional: Log all connection changes
    sock.ev.on("connection.update", (update) => {
      console.log("📡 Connection update:", update);
    });

  } catch (err) {
    console.error("❌ Failed to pair:", err);
    res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown",
    });
  }
});

module.exports = router;
