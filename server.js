const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // ✅ Load environment variables

const createPaymentRoute = require("./create-payment");
const confirmRoute = require("./sendEmail");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/create-payment", createPaymentRoute);
app.use("/confirm", confirmRoute);

// Health check
app.get("/", (req, res) => {
  res.send("✅ EXPRAS backend is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
