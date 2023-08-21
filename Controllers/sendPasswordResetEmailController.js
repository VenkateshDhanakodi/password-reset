const nodemailer = require('nodemailer'); // Importing nodemailer module
require('dotenv').config(); // Loading environment variables from .env file


//   Function to send password reset email
 
const sendPasswordResetEmail = async (user_mail, resetToken) => {
    // Creating a transporter for sending emails
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Using environment variable
            pass: process.env.EMAIL_PASSWORD, // Using environment variable
        },
    });

    // Constructing the reset link
    const resetLink = `https://willowy-parfait-4634b8.netlify.app/reset-password/routing/${resetToken}`;

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER, // app-specific email
        to: user_mail, // receiver's email
        subject: 'Password Reset',
        text: `Click the link to reset your password: ${resetLink}`,
    };

    try {
        await transporter.sendMail(mailOptions); // Sending the email
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.log("Error in sendPasswordResetEmail:", error);
        // Handle error
    }
};

// Export the function
module.exports = { sendPasswordResetEmail };
