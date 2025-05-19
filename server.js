const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const createPaymentRoute = require("./create-payment");
const confirmRoute = require("./sendEmail");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/create-payment", createPaymentRoute);
app.use("/confirm", confirmRoute);

app.get("/", (req, res) => {
  res.send("✅ EXPRAS backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
