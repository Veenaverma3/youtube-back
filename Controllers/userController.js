 const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite:'Lax'
}

exports.signUp = async (req, res) => {
  try {
    const { channelName, userName, password, about, profilePic } = req.body;
    console.log(channelName);
    const isExist = await User.findOne({ userName });
    if (isExist) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const updatedPass = await bcrypt.hash(password, 10);
      const user = new User({
        channelName,
        userName,
        password: updatedPass,
        about,
        profilePic,
      });
      await user.save();
      console.log("first", user);
      res
        .status(201)
        .json({
          message: "user registered successful",
          success: true,
          user,
        });
    }
  }  catch (error) {
  console.error("Signup Error:", error);
  res.status(500).json({ error: "Server error during signup" });
}
};

 
 exports.signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, 'veena');
    res.cookie('token', token, cookieOptions);

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

exports.logout = async (req, res) => {
  res.clearCookie('token', cookieOptions).json({ message: 'logged out successfully'})
}

 // userController.js
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // use req.user._id instead of req.userId
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error getting user" });
  }
};
