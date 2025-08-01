 const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
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

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user,
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

    const token = jwt.sign({ userId: user._id }, 'veena', {
      expiresIn: "90d",
    });

    res.cookie("token", token, cookieOptions);

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
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error getting user" });
  }
};

// ───────────── Get All Users ─────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("channelName profilePic");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
