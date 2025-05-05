const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure your SMTP credentials (e.g., ProtonMail Bridge or other provider)
const transporter = nodemailer.createTransport({
  host: "127.0.0.1",         // ProtonMail Bridge or other SMTP host
  port: 1025,                // Change to 587 or 465 if using real SMTP
  secure: false,             // Set to true if using port 465
  auth: {
    user: "bookings@expras.com",
    pass: "YP0paBZHdY5zIguL2cX-_A"
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.post("/confirm", async (req, res) => {
  const data = req.body;
  const reference = "EX-" + Date.now();
  const trackingLink = `https://expras.com/track/${reference}`;

  // Email HTML template
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
    // 1. Send confirmation email
    await transporter.sendMail({
      from: '"Expras Booking" <bookings@expras.com>',
      to: data.email,
      subject: `Confirmation – EXPRAS [${reference}]`,
      html: htmlTemplate
    });
    console.log("✅ Email sent to:", data.email);

    // 2. Send data to Google Sheets
    await axios.post("https://script.google.com/macros/s/AKfycbzOq_OhZJDx6jSn4uu3bu2xFRrrg6r8yWc0VGIBGCanyYI0Nffvqa5zr4aRHKNIrsC8/exec", {
      ...data,
      reference
    });
    console.log("📋 Data sent to Google Sheets for:", reference);

    // 3. Return success response
    res.status(200).json({ success: true, reference });
  } catch (error) {
    console.error("❌ Error during /confirm:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

