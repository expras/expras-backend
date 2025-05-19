const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post("/", async (req, res) => {
  const { totalAmount, email } = req.body;

  try {
    const response = await axios.post(
      "https://api.mollie.com/v2/payments",
      {
        amount: {
          currency: "EUR",
          value: parseFloat(totalAmount).toFixed(2),
        },
        description: "Réservation EXPRAS",
        redirectUrl: "https://expras.com/thankyou.html",
        webhookUrl: "https://expras-backend.onrender.com/mollie-webhook",
        metadata: { email },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MOLLIE_KEY}`, // ✅ don't hardcode the test key!
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ paymentUrl: response.data._links.checkout.href });
  } catch (error) {
    console.error("❌ Mollie error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create Mollie payment" });
  }
});

module.exports = router;
