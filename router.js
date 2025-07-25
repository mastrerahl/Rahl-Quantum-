router.get("/pair", async (req, res) => {
  const number = req.query.number?.replace(/[^0-9]/g, "");
  if (!number || number.length < 10) {
    return res.status(400).json({ error: "Invalid number" });
  }

  const sessionId = makeid(5);
  const sessionDir = path.join(__dirname, "temp", sessionId);
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

    let sent = false;

    sock.ev.on("connection.update", async (update) => {
      if (update.connection === "open" && !sent) {
        sent = true;
        const sessionData = {
          creds: state.creds,
          keys: state.keys,
        };
        const sessionString = Buffer.from(JSON.stringify(sessionData)).toString("base64");
        const finalSession = `LORD-RAHL~${sessionId}#${sessionString}`;
        const sessionFilePath = path.join(__dirname, "temp", `${sessionId}.txt`);
        fs.writeFileSync(sessionFilePath, finalSession);
        console.log("✅ LORD-RAHL session created.");
        return res.json({
          status: "connected",
          session: finalSession,
          message: "Paste this session into your bot",
        });
      }

      if (update.lastDisconnect?.error?.output?.statusCode) {
        console.log("❌ Connection closed");
      }
    });

    if (!sock.authState.creds.registered) {
      await delay(1500);
      const code = await sock.requestPairingCode(number);
      console.log(`🔑 Pairing code: ${code}`);
      // Don't return yet — let connection.open trigger the response
    } else {
      return res.status(409).json({ error: "Already linked" });
    }

    // Timeout fallback in case nothing happens
    setTimeout(() => {
      if (!sent) {
        return res.status(504).json({ error: "Timed out waiting for WhatsApp connection" });
      }
    }, 15000); // 15s max wait

  } catch (err) {
    console.error("❌ Error during pairing:", err);
    return res.status(500).json({ error: "Session failed", detail: err.message || "Unknown" });
  }
});
