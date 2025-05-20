const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Optional if deployed — handled by Render env

router.post('/', async (req, res) => {
  const { totalAmount, email } = req.body;

  try {
    const response = await axios.post(
      'https://api.mollie.com/v2/payments',
      {
        amount: {
          currency: 'EUR',
          value: parseFloat(totalAmount).toFixed(2),
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
      error: error.response?.data || error.message || 'Unknown error'
    });
  }
});

module.exports = router;

