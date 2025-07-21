// router.js — Handles /pair?number= for Rahl Quantum
const express = require("express");
const { makeid } = require("./gen-id");
const { create } = require("venom-bot");
const fs = require("fs");

const router = express.Router();
const sessions = {};

router.get("/pair", async (req, res) => {
  const number = req.query.number;
  console.log(`📥 Request received for number: ${number}`);

  if (!number || number.length < 10) {
    return res.status(400).json({ error: "Invalid number" });
  }

  const sessionId = makeid(5);

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
      browserArgs: ["--no-sandbox"],
    });

    sessions[number] = client;

    let responded = false;

    client.onStateChange(async (state) => {
      console.log(`📡 State changed for ${number}: ${state}`);

      if (state === "PAIRING" && !responded) {
        responded = true;
        try {
          const code = await client.getPairingCode();
          console.log(`🔑 Pairing code for ${number}: ${code}`);
          res.json({
            status: "pending",
            pairingCode: code,
            message: "Use this code in WhatsApp: Settings > Linked Devices",
          });
        } catch (err) {
          console.error("❌ Error getting pairing code:", err);
          res.status(500).json({ error: "Failed to generate code", detail: err.message });
        }
      }
    });

    setTimeout(() => {
      if (!responded) {
        responded = true;
        res.status(408).json({ error: "Timeout: Did not reach pairing state" });
      }
    }, 15000);
  } catch (err) {
    console.error("❌ Failed to initialize session:", err);
    res.status(500).json({ error: "Session failed", detail: err.message });
  }
});

module.exports = router;
