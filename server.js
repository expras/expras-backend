const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express(); // must be defined before using app.use()

// ✅ Middleware to parse JSON
app.use(express.json());
app.use(cors());

// ✅ Routes
const createPayment = require('./routes/create-payment');
app.use('/create-payment', createPayment);

// Optional test route
app.get('/', (req, res) => {
  res.send('Expras backend is live.');
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

