// router.js — Rahl Quantum Royal Bot Backend

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

  const sessionId = `rahl-${makeid(5)}`;

  // Avoid duplicate sessions
  if (sessions[number]) {
    return res.json({
      status: "active",
      message: "👑 Royal Session already exists for this number.",
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
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
        "--disable-software-rasterizer",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-features=site-per-process"
      ],
      puppeteerOptions: {
        executablePath: "/usr/bin/chromium", // Important for Render/Docker
        args: ["--no-sandbox"]
      }
    });

    sessions[number] = client;

    let responded = false;

    client.onStateChange(async (state) => {
      console.log(`📡 Rahl State: ${state}`);

      if (state === "PAIRING" && !responded) {
        try {
          const code = await client.getPairingCode();
          responded = true;
          console.log(`🔐 Royal Pairing Code for ${number}: ${code}`);
          return res.json({
            status: "pending",
            pairingCode: code,
            message: "📲 Enter this in WhatsApp: Settings → Linked Devices"
          });
        } catch (err) {
          responded = true;
          console.error("❌ Failed to generate code:", err);
          return res.status(500).json({
            error: "Pairing failed",
            detail: err.message || "Unknown error"
          });
        }
      }
    });

    // ⏱ Royal Timeout Fallback
    setTimeout(() => {
      if (!responded) {
        responded = true;
        res.status(408).json({ error: "⏳ Timeout: Pairing state not reached" });
      }
    }, 15000);

  } catch (err) {
    console.error("❌ Session Error:", err);
    return res.status(500).json({
      error: "Session failed",
      detail: err.message || "Unknown error"
    });
  }
});

module.exports = router;
