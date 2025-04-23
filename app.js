const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/v1/authRoutes');
const transactionRoutes = require('./routes/v1/transactionRoutes');
const walletRoutes = require('./routes/v1/walletRoutes');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/wallet', walletRoutes);



app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

module.exports = app;



