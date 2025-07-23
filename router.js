// router.js — Rahl Quantum Baileys Pairing
const express = require("express");
const { makeid } = require("./gen-id");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  Browsers,
  delay,
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

  const sessionId = makeid(5);
  const sessionDir = path.join(__dirname, "temp", sessionId);

  // Clean up the folder first to prevent corrupted or stale sessions
  if (fs.existsSync(sessionDir)) {
    fs.rmSync(sessionDir, { recursive: true, force: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  try {
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

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const code = lastDisconnect?.error?.output?.statusCode;
        if (code !== DisconnectReason.loggedOut) {
          console.log("🔁 Connection closed, trying to reconnect...");
        } else {
          console.log("❌ Logged out of WhatsApp");
        }
      } else if (connection === "open") {
        console.log("✅ WhatsApp connected successfully!");
      }
    });

    if (!sock.authState.creds.registered) {
      await delay(2000);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code for ${number}: ${code}`);

      return res.json({
        status: "pending",
        pairingCode: code,
        message: "Paste this code in WhatsApp > Linked Devices",
      });
    }

    res.status(409).json({ error: "Already logged in" });
  } catch (err) {
    console.error("❌ Error generating code:", err);
    res.status(500).json({ error: "Session failed", detail: err.message });
  }
});

module.exports = router;
