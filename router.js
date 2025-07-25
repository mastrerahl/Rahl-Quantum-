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

    let sessionSent = false;

    sock.ev.on("connection.update", async (update) => {
      const { connection } = update;

      if (connection === "open" && !sessionSent) {
        sessionSent = true;
        const sessionData = {
          creds: state.creds,
          keys: state.keys,
        };

        const sessionString = Buffer.from(JSON.stringify(sessionData)).toString("base64");
        const finalSession = `LORD-RAHL~${sessionId}#${sessionString}`;

        const sessionPath = path.join(__dirname, "session", `${sessionId}.txt`);
        fs.writeFileSync(sessionPath, finalSession);

        console.log("✅ Session Created!");
        res.json({
          status: "connected",
          session: finalSession,
          message: "✅ Paste this session in your bot config",
        });
      }
    });

    if (!sock.authState.creds.registered) {
      await delay(2000);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code for ${number}: ${code}`);

      res.json({
        status: "pending",
        pairingCode: code,
        message: "Open WhatsApp > Linked Devices > Enter code",
      });
    } else {
      res.status(409).json({ error: "Already linked" });
    }
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Session failed", detail: err.message });
  }
});

module.exports = router;
