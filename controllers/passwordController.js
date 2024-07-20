/* eslint-disable no-undef */
const { User, validateChangePassword } = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

/**
 * @description Forgot password
 * @route       GET /password/forgot-password
 * @access      public
 */
module.exports.getForgotPasswordView = asyncHandler ((req, res) => {
  res.render('forgot-password');
});

/**
 * @description Send Forgot password link
 * @route       POST /password/forgot-password
 * @access      public
 */
module.exports.sendForgotPasswordLink = asyncHandler ( async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const secret = process.env.JWT_SECRET + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: '10m'
  });

  const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Password Reset',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333333;
          }
          p {
            color: #666666;
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
          }
          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Password Reset</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to reset it.</p>
          <a href="${link}" class="button">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          <p>Thanks,<br>The Team</p>
        </div>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Email could not be sent' });
    } else {
      console.log('Email sent: ' + info.response);
      res.render('success-email');
    }
  });
});

/**
 * @description Get reset password view
 * @route       GET /password/reset-password/:userId/:token
 * @access      public
 */
module.exports.getResetPasswordView = asyncHandler ( async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render('reset-password', { email: user.email });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

/**
 * @description Reset password
 * @route       POST /password/reset-password/:userId/:token
 * @access      public
 */
module.exports.resetThePassword = asyncHandler ( async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(req.params.token, secret);

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user.password = req.body.password;
    await user.save();
    res.render('success-password');
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});
