// router.js — Lord Rahl Session Generator (Improved)

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

  const sessionId = makeid(5);
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

    // 🔐 Pairing code first
    if (!sock.authState.creds.registered) {
      await delay(1500);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code for ${number}: ${code}`);

      res.json({
        status: "pending",
        pairingCode: code,
        message: "Use this code in WhatsApp: Settings > Linked Devices",
      });

      // 🧠 Wait for connection after response is sent
      sock.ev.on("connection.update", async (update) => {
        if (update.connection === "open") {
          console.log("✅ WhatsApp connected!");

          const sessionData = {
            creds: state.creds,
            keys: state.keys,
          };

          const sessionString = Buffer.from(JSON.stringify(sessionData)).toString("base64");
          const finalSession = `LORD-RAHL~${sessionId}#${sessionString}`;
          const sessionFilePath = path.join(__dirname, "session", `${sessionId}.txt`);
          fs.writeFileSync(sessionFilePath, finalSession);
          console.log("✅ LORD-RAHL session saved successfully!");
        }
      });
    } else {
      res.status(409).json({ error: "Already linked" });
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
