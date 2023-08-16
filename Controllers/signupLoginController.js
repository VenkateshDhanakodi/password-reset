const mongoose = require('mongoose')
const { userModel } = require('../Schema/usersSchema');
const { dbUrl } = require('../Config/dbConfig');
const { hashPassword, hashCompare, createToken, verifyToke } = require('../Config/auth');
const {sendPasswordResetEmail} = require('./sendPasswordResetEmailController');
mongoose.connect(dbUrl);

const signupLoginController = {
    //Signup operation
    signUp: async (req, res) => {
        try {
            const email = await userModel.findOne({ email: req.body.email });
            if (!email) {
                req.body.password = await hashPassword(req.body.password);
                let user = new userModel(req.body);
                await user.save();
                res.status(201).send({
                    message: "SignUp successfully completed",
                })
            }
            else {
                res.status(400).send({
                    message: "Email already registered, please login to proceed",
                })
            }
        } catch (error) {
            console.log("Internal Server Error");
            res.status(500).send({
                message: "Internal Server Error", error
            })
        }
    },

    //Login operation
    login: async (req, res) => {
        try {
          let user = await userModel.findOne({ email: req.body.email });
          if (!user) {
            res.status(400).send({
              message: "Invalid Email Id entered",
            });
            return;
          }
    
          if (await hashCompare(req.body.password, user.password)) {
            res.status(200).send({
              message: "Login successful",
            });
          } else {
            res.status(400).send({
              message: "Password does not match",
            });
          }
        } catch (error) {
          console.log("Error:", error);
          console.log("Internal Server Error");
          res.status(500).send({
            message: "Internal Server Error",
            error,
          });
        }
    },

    //Forgot password operation
    forgotPassword: async (req, res) => {
        try {
            const user = await userModel.findOne({ email: req.body.email });
            if (!user) {
                res.status(400).send({
                    message: "Email not found",
                });
                return;
            }
            // Generating and storing the reset token in the database
            const resetToken = createToken({ email: req.body.email });
            user.token = resetToken;
            await user.save();
            // Calling sendPasswordResetEmail function with the resetToken parameter
            sendPasswordResetEmail(req.body.email, resetToken);

            res.status(200).send({
                message: "Password reset link sent to your email", 
                resetToken: user.token
            });

        } catch (error) {
            console.log("Internal Server Error");
            res.status(500).send({
                message: "Internal Server Error", error
            });
        }
    }
}
module.exports = signupLoginController;