 const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const cookieOptions = {
  httpOnly: true,
  secure: false, // set to true in production (HTTPS)
  sameSite: "Lax",
  maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
};
// ───────────── Signup ─────────────
exports.signUp = async (req, res) => {
  try {
    const { channelName, userName, password, about, profilePic } = req.body;
    const isExist = await User.findOne({ userName });

    if (isExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      channelName,
      userName,
      password: hashedPassword,
      about,
      profilePic,
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
       res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        channelName: user.channelName,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// ───────────── Login / SignIn ─────────────
exports.signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

 res.cookie("token", token, cookieOptions);
 console.log("Token set in cookies:", token);
    res.json({
      message: "Logged in successfully",
      success: true,
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        channelName: user.channelName,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("SignIn Error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ───────────── Logout ─────────────
exports.logout = async (req, res) => {
  res.clearCookie("token", cookieOptions).json({ message: "Logged out successfully" });
};

// ───────────── Get Current User ─────────────
 exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.status(200).json({ user });
    console.log("req.user:", req.user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    res.status(500).json({ message: "Error getting user" });
  }
};


 