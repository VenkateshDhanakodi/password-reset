const express = require('express');
const router = express.Router(); 
const resetPasswordController = require('../Controllers/resetPasswordController');

//Defining route for resetPasswordPage, resetPassword
router.get('/', resetPasswordController.resetPasswordPage);
router.post('/', resetPasswordController.resetPassword);

module.exports = router;
