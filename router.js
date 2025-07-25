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

    // 🛑 STEP 1: Check if already linked
    if (sock.authState.creds.registered) {
      return res.status(409).json({ error: "Already linked" });
    }

    // ✅ STEP 2: Generate pairing code FIRST
    const code = await sock.requestPairingCode(number);
    if (!code) {
      throw new Error("Pairing code not generated");
    }

    console.log(`🔑 Pairing code for ${number}: ${code}`);

    // 🔄 STEP 3: Now wait for connection to complete
    const session = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("⏰ Timeout waiting for WhatsApp connection"));
      }, 30000); // wait max 30 sec

      sock.ev.on("connection.update", (update) => {
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
            pairingCode: code,
            session: finalSession,
            message: "Paste this session into your bot env",
          });
        }
      });
    });

    // 🔚 STEP 4: Respond with both code and session
    return res.json(session);

  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown error",
    });
  }
});
