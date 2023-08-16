const { userModel } = require('../Schema/usersSchema'); // Importing the user model schema
const { hashPassword, verifyToken } = require('../Config/auth'); // Importing hashing and token verification functions

// Function to handle the reset password page rendering
const resetPasswordPage = (req, res) => {
  const token = req.query.token; // Get the token from the query parameter
  if (!token) {
    return res.status(400).send({ message: 'Token is missing' }); // Token missing error
  }

  // Verify the token
  const decodedToken = verifyToken(token); // Verifying the token
  if (!decodedToken) {
    return res.status(400).send({ message: 'Invalid or expired token' }); // Invalid or expired token error
  }

  // Token is valid, render the password reset page
  res.render('reset-password', { token }); // Render the password reset page with token
};

// Function to handle password reset
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body; // Get token and new password from request body
  if (!token || !newPassword) {
    return res.status(400).send({ message: 'Token and newPassword are required' }); // Token and newPassword missing error
  }

  // Verify the token
  const decodedToken = verifyToken(token); // Verifying the token
  if (!decodedToken) {
    return res.status(400).send({ message: 'Invalid or expired token' }); // Invalid or expired token error
  }

  try {
    // Find the user by email
    const user = await userModel.findOne({ email: decodedToken.email }); // Finding the user by email
    if (!user) {
      return res.status(400).send({ message: 'User not found' }); // User not found error
    }

    // Update the user's password
    user.password = await hashPassword(newPassword); // Hashing and updating the password
    user.token = undefined; // Remove the token
    await user.save(); // Saving the user changes

    res.status(200).send({ message: 'Password updated successfully' }); // Success response
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send({ message: 'Internal Server Error' }); // Internal server error
  }
};

// Exporting the functions for use in other modules
module.exports = { resetPasswordPage, resetPassword };
