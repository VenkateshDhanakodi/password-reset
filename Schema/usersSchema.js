const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email'
        }
    },
    password: { type: String, required: true },
    token: {type: String},
    createdAt: { type: Date, default: Date.now() }
},{versionKey: false});

const userModel = mongoose.model('users', userSchema);
module.exports = { userModel };
