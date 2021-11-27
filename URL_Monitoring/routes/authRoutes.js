const express = require("express");
const router = express.Router();
const { signUp, signIn, verifyEmail } = require('../controllers/authController');


router.post('/signin',signIn);

router.post('/signup', signUp);

router.get('/verify/email', verifyEmail);

module.exports = router;

