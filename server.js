const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const router = require("./router");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
