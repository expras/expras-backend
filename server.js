const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express(); // ✅ app must be defined before using it

app.use(express.json()); // ✅ parse JSON body
app.use(cors());

// ✅ Routes
const createPayment = require('./routes/create-payment');
app.use('/create-payment', createPayment);

// Optional health check
app.get('/', (req, res) => {
  res.send('Expras backend is live.');
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

