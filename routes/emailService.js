const express = require('express');
const router = express.Router();
const sendPasswordResetEmailController = require('../Controllers/sendPasswordResetEmailController');

// Defining a route to handle sending password reset emails
router.post('/send-password-reset-email', sendPasswordResetEmailController.sendPasswordResetEmail);

module.exports = router;
