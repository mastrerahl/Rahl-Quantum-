const express = require("express");
const { makeid } = require("./gen-id");
const { create } = require("venom-bot");
const router = express.Router();
const sessions = {};

router.get("/pair", async (req, res) => {
  const number = req.query.number;
  console.log(`📥 Request received for number: ${number}`);

  if (!number || number.length < 10) {
    return res.status(400).json({ error: "Invalid number" });
  }

  const sessionId = `session/rahl-quantum-${makeid(4)}`;

  if (sessions[number]) {
    return res.json({
      status: "active",
      message: "Session already exists for this number.",
    });
  }

  try {
    const client = await create({
      session: sessionId,
      multidevice: true,
      headless: true,
      browserArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-features=site-per-process"
      ],
      puppeteerOptions: {
        args: ['--no-sandbox'],
      },
    });

    sessions[number] = client;
    let responded = false;

    client.onStateChange(async (state) => {
      console.log(`📡 State changed for ${number}: ${state}`);

      if (state === "PAIRING" && !responded) {
        responded = true;
        try {
          const code = await client.getPairingCode();
          console.log(`🔑 Code for ${number}: ${code}`);
          return res.json({
            status: "pending",
            pairingCode: code,
            message: "Use this code in WhatsApp: Settings > Linked Devices",
          });
        } catch (err) {
          console.error("❌ Code error:", err);
          return res.status(500).json({
            error: "Failed to generate code",
            detail: err.message,
          });
        }
      }
    });

    setTimeout(() => {
      if (!responded) {
        responded = true;
        res.status(408).json({ error: "Timeout: Pairing not reached" });
      }
    }, 30000); // Increased timeout to 30s

  } catch (err) {
    console.error("❌ Initialization failed:", err);
    res.status(500).json({ error: "Session failed", detail: err.message || "Unknown error" });
  }
});

module.exports = router;
