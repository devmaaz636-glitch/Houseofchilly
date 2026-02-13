// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// In-memory storage for reset tokens
const resetTokens = {}; // { token: email }

// Test route
app.get("/", (req, res) => res.send("Backend running"));

// ✅ Forgot Password Route
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    // Generate a unique token
    const token = crypto.randomBytes(20).toString("hex");
    resetTokens[token] = email; // save token temporarily

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Reset link points to local Expo app with token
    const resetLink = `exp://127.0.0.1:19000/--/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "House of Chilly - Reset Password",
      text: `Hello! Click this link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: `Reset link sent to ${email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send email" });
  }
});

// ✅ Reset Password Route
app.post("/api/auth/reset-password", (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res.status(400).json({ msg: "Token and new password required" });

  const email = resetTokens[token];
  if (!email) return res.status(400).json({ msg: "Invalid or expired token" });

  // TODO: Update user password in your database here
  console.log(`Password for ${email} changed to: ${newPassword}`);

  // Delete token after use
  delete resetTokens[token];

  res.json({ msg: "Password updated successfully" });
});

// Start server
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);