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

    if (!sock.authState.creds.registered) {
      await delay(1500);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code for ${number}: ${code}`);

      // ⏳ Now wait for session to connect and return response
      const sessionPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("⏰ Timeout waiting for connection"));
        }, 20000); // 20 seconds max wait

        sock.ev.on("connection.update", async (update) => {
          if (update.connection === "open") {
            clearTimeout(timeout);

            const sessionData = {
              creds: state.creds,
              keys: state.keys,
            };

            const sessionString = Buffer.from(JSON.stringify(sessionData)).toString("base64");
            const finalSession = `LORD-RAHL~${sessionId}#${sessionString}`;

            const sessionFilePath = path.join(__dirname, "session", `${sessionId}.txt`);
            fs.writeFileSync(sessionFilePath, finalSession);

            console.log("✅ LORD-RAHL session created!");
            resolve({
              status: "connected",
              session: finalSession,
              message: "Paste this session to your bot env",
            });
          }
        });
      });

      const final = await sessionPromise;
      return res.json(final);
    } else {
      return res.status(409).json({ error: "Already linked" });
    }
  } catch (err) {
    console.error("❌ Failed to pair:", err);
    return res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown",
    });
  }
});

module.exports = router;
