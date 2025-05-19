const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const createPayment = require("./create-payment");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/create-payment", createPayment);

app.get("/", (req, res) => {
  res.send("EXPRAS backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
