 // middleware/Authentication.js
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  console.log("🔐 Received token from cookies:", token);

  if (!token) {
    return res.status(401).json({ error: "No token, authentication denied" });
  }

  try {
    const decoded = jwt.verify(token, "Its_My_Secret_Key");

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // ✅ this is important
    next();
  } catch (err) {
    console.error("❌ Error verifying token:", err);
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = auth;
