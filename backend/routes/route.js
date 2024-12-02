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
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
              <title>New Password</title>
              <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700&display=swap" rel="stylesheet">
              <style>
                  body {
                      margin: 0;
                      background: #EADDCA;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      min-height: 100vh;
                      font-family: 'Kanit', sans-serif;
                  }

                  .combined-container {
                      display: flex;
                      align-items: center;
                      border-radius: 25px;
                      padding: 60px;
                      background-color: #EADDCA;
                  }

                  .logo {
                      width: 400px;
                      height: auto;
                      margin-right: 50px;
                  }

                  .forgot-password-container {
                      width: 100%;
                      max-width: 400px;
                      padding: 20px;
                      text-align: left;
                  }

                  .forgot-password-title {
                      text-align: center;
                  }

                  .instruction-message {
                      text-align: center;
                      margin: 10px 0 20px;
                  }

                  .password-label {
                      font-weight: 400;
                      margin-bottom: 5px;
                      display: block;
                  }

                  .frame1, .frame2 {
                      width: 90%;
                      height: 55px;
                      border-radius: 25px;
                      margin-bottom: 20px;
                      padding: 0 20px;
                      border: 2px solid black;
                      background: #FFFFFF;
                  }

                  .frame1:focus, .frame2:focus {
                      border-color: black;
                      outline: none;
                  }

                  .frame3 {
                      width: 100%;
                      height: 55px;
                      background: #90604C;
                      color: #FFFFFF;
                      font-weight: 800;
                      cursor: pointer;
                      border: 2px solid black;
                      border-radius: 25px;
                  }

                  .frame3:active {
                      background-color: #704236;
                  }

                  .back-to-login {
                      font-weight: 300;
                      color: #90604C;
                      text-decoration: underline;
                      margin-top: 10px;
                      display: block;
                      text-align: center;
                  }
              </style>
          </head>
          <body>
              <div class="combined-container">
                  <img src="../images/logo.png" alt="Logo" class="logo">

                  <div class="forgot-password-container">
                      <header>
                          <h1 class="forgot-password-title">New Password</h1>
                      </header>

                      <section class="instruction-message">Please enter your new password.</section>

                      <form>
                          
                          <input type="password" class="frame1" placeholder="Create new password" required>
                          <input type="password" class="frame2" placeholder="Confirm your password" required>

                          
                          <button type="button" class="frame3 reset-password" onclick="window.location.href='login.html'">Change Password</button>
                      </form>

                      <section class="instruction-message">or</section>

                    
                      <button type="button" class="frame3 reset-password" onclick="window.location.href='login.html'">Recover Password</button>

                      <a class="back-to-login" href="login.html">Back to login</a>
                  </div>
              </div>

              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
          </body>
          </html>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).json({ message: "Sending email error" });
        } else {
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
