const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Load env vars like MOLLIE_KEY

router.post('/', async (req, res) => {
  try {
    const { totalAmount, email } = req.body;

    if (!totalAmount || !email) {
      return res.status(400).json({ error: 'Missing totalAmount or email' });
    }

    const formattedAmount = parseFloat(totalAmount).toFixed(2).toString(); // Ensures valid format

    const response = await axios.post(
      'https://api.mollie.com/v2/payments',
      {
        amount: {
          currency: 'EUR',
          value: formattedAmount, // must be string like "65.00"
        },
        description: 'Réservation EXPRAS',
        redirectUrl: 'https://expras.com/thankyou.html',
        webhookUrl: 'https://expras-backend.onrender.com/mollie-webhook',
        metadata: { email },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MOLLIE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ paymentUrl: response.data._links.checkout.href });
  } catch (error) {
    console.error('Mollie error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message || 'Unknown error',
    });
  }
});

module.exports = router;

