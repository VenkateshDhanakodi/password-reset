const express = require('express');
const router = express.Router(); 
const signupLoginController = require('../Controllers/signupLoginController');

//Defining routes for signUp, login, forgotPassword
router.post('/signUp', signupLoginController.signUp);
router.post('/login', signupLoginController.login);
router.post('/forgot-password', signupLoginController.forgotPassword);

module.exports = router;
