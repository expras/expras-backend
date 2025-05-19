const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post("/", async (req, res) => {
  const data = req.body;
  const reference = "EX-" + Date.now();
  const trackingLink = `https://expras.com/track/${reference}`;
  const manageLink = `https://expras.com/manage/${reference}`;
  const supportPhone = "+33 6 23 08 60 54";
  const supportEmail = "info@expras.com";
  const supportHours = "9h-18h (Lun-Ven)";

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Confirmation de réservation – ${reference}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;">
      <tr>
        <td align="center" style="padding:20px 0;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
            <tr>
              <td align="center" style="background-color:#1b3c88; padding:24px;">
                <img src="https://www.expras.com/assets/logo.png" alt="Expras" width="150" height="50" style="display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding:24px; color:#333;">
                <h1 style="font-size:20px; margin:0;">Confirmation de réservation – Réf. ${reference}</h1>
                <p style="font-size:16px; line-height:24px;">
                  Bonjour <strong>${data.firstName} ${data.lastName}</strong>,<br/>
                  Merci d’avoir choisi <strong>Expras</strong> ! Voici les détails de votre réservation :
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; font-size:15px;">
                  <tr><td colspan="2" style="background-color:#1b3c88; color:#fff; padding:8px 12px; font-weight:bold;">Détails de la réservation</td></tr>
                  <tr><td style="border:1px solid #ddd; padding:8px;">Référence</td><td style="border:1px solid #ddd; padding:8px;">${reference}</td></tr>
                  <tr><td style="border:1px solid #ddd; padding:8px;">Enlèvement</td><td style="border:1px solid #ddd; padding:8px;">${data.pickupDate}<br/>${data.pickupAddress}, ${data.pickupPostal} ${data.pickupCity}</td></tr>
                  <tr><td style="border:1px solid #ddd; padding:8px;">Livraison</td><td style="border:1px solid #ddd; padding:8px;">${data.dropoffDate}<br/>${data.dropoffAddress}, ${data.dropoffPostal} ${data.dropoffCity}</td></tr>
                  <tr><td style="border:1px solid #ddd; padding:8px;">Valises</td><td style="border:1px solid #ddd; padding:8px;">${data.luggageQty}</td></tr>
                </table>

                <div style="height:24px;"></div>

                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; font-size:15px;">
                  <tr><td colspan="2" style="background-color:#1b3c88; color:#fff; padding:8px 12px; font-weight:bold;">Paiement</td></tr>
                  <tr><td style="border:1px solid #ddd; padding:8px;">Montant total</td><td style="border:1px solid #ddd; padding:8px;">${data.totalAmount} €</td></tr>
                  <tr><td style="border:1px solid #ddd; padding:8px;">Statut</td><td style="border:1px solid #ddd; padding:8px;">Confirmé</td></tr>
                  <tr><td style="border:1px solid #ddd; padding:8px;">Méthode</td><td style="border:1px solid #ddd; padding:8px;">Carte bancaire</td></tr>
                </table>

                <div style="height:24px;"></div>

                <div style="text-align:center;">
                  <a href="${trackingLink}" style="display:inline-block; margin:4px; padding:12px 24px; background-color:#1b3c88; color:#fff; text-decoration:none; border-radius:4px;">📦 Suivi en temps réel</a>
                  <a href="${manageLink}" style="display:inline-block; margin:4px; padding:12px 24px; background-color:#727272; color:#fff; text-decoration:none; border-radius:4px;">Modifier / Annuler</a>
                </div>

                <div style="height:32px;"></div>

                <p style="font-size:15px; line-height:22px;">
                  <strong>Avant le passage du coursier :</strong>
                  <ul>
                    <li>Étiquetez chaque valise avec votre nom et votre référence.</li>
                    <li>Respectez le poids maximum (30 kg/valise).</li>
                    <li>Vous pouvez modifier la réservation jusqu’à la veille.</li>
                  </ul>
                </p>

                <p style="font-size:15px; line-height:22px;">
                  <strong>Besoin d’aide ?</strong><br/>
                  Téléphone : <a href="tel:${supportPhone}" style="color:#1b3c88;">${supportPhone}</a> (${supportHours})<br/>
                  Email : <a href="mailto:${supportEmail}" style="color:#1b3c88;">${supportEmail}</a><br/>
                  Vous pouvez également répondre directement à cet e-mail.
                </p>

                <div style="height:24px;"></div>

                <p style="text-align:center; font-size:14px; color:#777;">
                  Expras – 17 rue de Rosheim, Strasbourg<br/>
                  <a href="https://expras.com/terms" style="color:#1b3c88;">Conditions générales</a> | 
                  <a href="https://instagram.com/expras" style="color:#1b3c88;">Instagram</a> | 
                  <a href="https://linkedin.com/company/expras" style="color:#1b3c88;">LinkedIn</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: '"Expras Booking" <bookings@expras.com>',
      to: data.email,
      subject: `Confirmation – EXPRAS [${reference}]`,
      html: htmlTemplate,
    });

    await axios.post(
      "https://script.google.com/macros/s/AKfycbzOq_OhZJDx6jSn4uu3bu2xFRrrg6r8yWc0VGIBGCanyYI0Nffvqa5zr4aRHKNIrsC8/exec",
      { ...data, reference }
    );

    res.status(200).json({ success: true, reference });
  } catch (err) {
    console.error("❌ Email error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

