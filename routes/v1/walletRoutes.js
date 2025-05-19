const express = require('express');
const jwt = require('jsonwebtoken');
const { getWalletBalance, addFundsToWallet, transferFunds } = require('../../controllers/v1/walletController');
const {validateToken } = require('../../middleware/auth');

const router = express.Router();


router.post('/add-funds',  addFundsToWallet);
router.post('/transfer', validateToken, transferFunds);
router.get('/balance/:id', validateToken, getWalletBalance);


module.exports = router;

