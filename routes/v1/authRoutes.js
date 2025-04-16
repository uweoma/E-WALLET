const express = require('express');
const jwt = require('jsonwebtoken');
const { register, login, getProfile, updateProfile } = require('../../controllers/v1/authController');
const {validateToken, checkUser} = require('../../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login',  login);
router.get('/profile',  getProfile);
router.put('/profile', validateToken, checkUser, updateProfile);


module.exports = router;

