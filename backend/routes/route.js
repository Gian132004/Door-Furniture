const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const Login = require("../models/loginmodel"); // Import login model

// Login route
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists in MongoDB
    const user = await Login.findOne({ username, password });

    if (user) {
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const user = true;

    if (user) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.PASSWORD}`,
        },
      });

      const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `giannicolaiduhan@gmail.com`,
        subject: "Forgot Password",
        text: "Forgot password click button to reset password",
        html: `
          <p>Forgot your password? Click the button below to change it:</p>
          <a href="http://localhost:5500" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
        `
      };      

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).json({ message: "Sending email error" });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json({ message: "Email sent successful" });
        }
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (e) {
    res.status(500).json({ message: "Sending email error" });
  }
});

module.exports = router;
