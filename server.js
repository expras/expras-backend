const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// ✅ Enable JSON parsing middleware
app.use(express.json());
app.use(cors());

// ✅ Route setup
const createPaymentRoute = require('./routes/create-payment'); // adjust if needed
app.use('/create-payment', createPaymentRoute);

// Optional: root route for testing
app.get('/', (req, res) => {
  res.send('Expras backend is running.');
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

