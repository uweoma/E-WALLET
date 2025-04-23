const express = require('express');
const jwt = require('jsonwebtoken');
const { getTransactionHistory } = require('../../controllers/v1/transactionController');
const {validateToken, checkUser} = require('../../middleware/auth');

const router = express.Router();


router.get('/', getTransactionHistory);


module.exports = router;


