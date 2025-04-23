const express = require('express');
const jwt = require('jsonwebtoken');
const { getWalletBalance, addFundsToWallet, transferFunds } = require('../../controllers/v1/walletController');
const {validateToken, checkUser} = require('../../middleware/auth');

const router = express.Router();


router.post('/add-funds',  addFundsToWallet);
router.post('/transfer',  transferFunds);
router.get('/balance', getWalletBalance);


module.exports = router;

