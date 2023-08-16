const bcrypt = require('bcryptjs'); // Importing bcrypt library for password hashing
const nodemailer = require('nodemailer'); // Importing nodemailer for sending emails
require('dotenv').config(); // Loading environment variables from .env file
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken library for creating and verifying tokens

const secretKey = "mqnwr#m!2%psodp^2"; // A secret key for JWT
const saltround = 10; // Number of salt rounds for bcrypt hashing

// Function to hash a password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltround); // Generating a salt for hashing
    const hash = await bcrypt.hash(password, salt); // Hashing the password with the generated salt
    return hash; // Returning the hashed password
};

// Function to compare a password with its hash
const hashCompare = async (password, hash) => {
    return await bcrypt.compare(password, hash); // Comparing the password and its hash
};

// Function to create a token
const createToken = ({ email }) => {
    let token = jwt.sign({ email }, secretKey, { expiresIn: '1hr' }); // Creating a token with email payload
    return token; // Returning the created token
}

// Function to verify a token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey); // Verifying the token with the secret key
        return decoded; // Returning the decoded token (payload)
    } catch (error) {
        return null; // Token is invalid or expired
    }
};

// Exporting the functions for use in other modules
module.exports = { hashPassword, hashCompare, createToken, verifyToken };
