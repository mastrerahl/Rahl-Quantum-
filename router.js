const express = require("express");
const { makeid } = require("./gen-id");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  delay,
  Browsers,
  DisconnectReason,
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

    // Save session credentials
    sock.ev.on("creds.update", saveCreds);

    // 👇 Listen for connection updates
    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "open") {
        console.log(`✅ Rahl Quantum linked successfully for ${number}`);
        // Optional: Save something to indicate success
        fs.writeFileSync(
          path.join(sessionDir, "linked.txt"),
          `Linked successfully at ${new Date().toISOString()}`
        );
      }

      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;
        if (reason === DisconnectReason.loggedOut) {
          console.log("❌ Logged out");
        } else {
          console.log("⚠️ Connection closed, retrying...");
        }
      }
    });

    // Send pairing code
    if (!sock.authState.creds.registered) {
      await delay(1500);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code for ${number}: ${code}`);

      return res.json({
        status: "pending",
        pairingCode: code,
        message: "Paste this code in WhatsApp > Linked Devices",
      });
    } else {
      res.status(409).json({ error: "Already linked" });
    }
  } catch (err) {
    console.error("❌ Failed to pair:", err);
    res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown error",
    });
  }
});

module.exports = router;
