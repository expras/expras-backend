const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ MUST be above routes
app.use(express.json());
app.use(cors());

// ✅ Load your route
const createPayment = require('./routes/create-payment');
app.use('/create-payment', createPayment);

// Test endpoint
app.get('/', (req, res) => {
  res.send('Server is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

