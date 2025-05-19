const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

// Optional if using router separately, otherwise middleware is already set in server.js
router.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

router.post("/", async (req, res) => {
  const data = req.body;
  const reference = "EX-" + Date.now();
  const trackingLink = `https://expras.com/track/${reference}`;

  const htmlTemplate = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Confirmation de réservation – Réf. ${reference}</h2>
        <p>Bonjour <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p>Merci d’avoir réservé avec <strong>Expras</strong> ! Voici les détails :</p>
        <ul>
          <li><strong>Référence :</strong> ${reference}</li>
          <li><strong>Enlèvement :</strong> ${data.pickupDate}, ${data.pickupAddress}, ${data.pickupCity} ${data.pickupPostal}</li>
          <li><strong>Livraison :</strong> ${data.dropoffDate}, ${data.dropoffAddress}, ${data.dropoffCity} ${data.dropoffPostal}</li>
          <li><strong>Valises :</strong> ${data.luggageQty}</li>
          <li><strong>Montant total :</strong> ${data.totalAmount} €</li>
        </ul>
        <p>📦 <a href="${trackingLink}">Suivre votre livraison</a></p>
        <p>— L'équipe Expras</p>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: '"Expras Booking" <bookings@expras.com>',
      to: data.email,
      subject: `Confirmation – EXPRAS [${reference}]`,
      html: htmlTemplate
    });

    console.log("✅ Email sent to:", data.email);

    await axios.post("https://script.google.com/macros/s/AKfycbzOq_OhZJDx6jSn4uu3bu2xFRrrg6r8yWc0VGIBGCanyYI0Nffvqa5zr4aRHKNIrsC8/exec", {
      ...data,
      reference
    });

    res.status(200).json({ success: true, reference });
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
