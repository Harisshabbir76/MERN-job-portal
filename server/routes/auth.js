const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");


router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("age").notEmpty().withMessage("Age is required").isNumeric().withMessage("Age must be a number"),
    body("role").notEmpty().withMessage("Role is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password,age,role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword,age,role });
      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user & return token
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);


router.get('/logout', function(req, res){
  res.clearCookie('token');
  res.status(200).json({message: 'logged out successfully'});
});




router.get("/user/applied-jobs", authMiddleware, async (req, res) => {
  try {
      

      const user = await User.findById(req.user._id).select("appliedJobs");
      if (!user) return res.status(404).json({ error: "User not found" });

      

      res.json(user.appliedJobs || []); // Ensure it's an array
  } catch (err) {
      
      res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get("/user", authMiddleware, async (req, res) => {
  try {
      console.log("User ID from token:", req.user._id); // Debugging

      const user = await User.findById(req.user._id).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
  } catch (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.put("/user/update", authMiddleware, async (req, res) => {
  try {
    console.log("Updating user:", req.user._id); // Debugging line

    const { skills, linkedin, portfolio, phone, education } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills, linkedin, portfolio, phone, education },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





const verificationCodes = {}; // Temporary storage for verification codes

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a 6-digit random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = verificationCode;

    // Check if Nodemailer is set up properly
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      return res.status(500).json({ error: "Email service not configured" });
    }

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your password reset code is: ${verificationCode}`,
    });


    res.json({ message: "Verification code sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});




router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (verificationCodes[email] !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    res.json({ message: "Verification successful. You can now reset your password." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (verificationCodes[email] !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Remove the verification code
    delete verificationCodes[email];

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});






module.exports = router;