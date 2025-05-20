const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Load MOLLIE_KEY

router.post('/', async (req, res) => {
  const { totalAmount, email } = req.body;

  if (!totalAmount?.toString().trim() || !email?.toString().trim()) {
    return res.status(400).json({ error: 'Missing totalAmount or email' });
  }

  const formattedAmount = parseFloat(totalAmount).toFixed(2).toString(); // "65.00"

  try {
    const response = await axios.post(
      'https://api.mollie.com/v2/payments',
      {
        amount: {
          currency: 'EUR',
          value: formattedAmount, // Must be string with 2 decimals
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

