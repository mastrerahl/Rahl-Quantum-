// server.js — Rahl Quantum Royal Backend
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router");

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve pair.html and assets
app.use("/", router); // handles /pair?number=

app.get("/", (req, res) => {
  res.send("👑 Rahl Quantum Backend is online.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`👑 Royal Backend Live on http://localhost:${PORT}`);
});
