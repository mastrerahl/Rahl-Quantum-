// server.js — Rahl Quantum Royal Backend
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router");

app.use(cors());
app.use(express.json());

// ✅ This serves all static files like /pair.html, /assets/rahl-bg.jpg, etc
app.use(express.static("public"));

// 💬 Your main router
app.use("/", router);

app.get("/", (req, res) => {
  res.send("👑 Rahl Quantum Royal Backend is online.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`👑 Royal Backend Live at http://localhost:${PORT}`);
});
