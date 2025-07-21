const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router");

app.use(cors());
app.use(express.json());
app.use("/", router); // handles /pair

app.get("/", (req, res) => {
  res.send("👑 Rahl Quantum Royal Backend is online.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`👑 Royal Backend Live on http://localhost:${PORT}`);
});
