 const jwt = require('jsonwebtoken');
 require('dotenv').config();
const auth = async (req, res, next) => {

  const token = req.cookies.token; // 🔥 Must come from cookies
  console.log("Received token from cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authentication denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // use your secret
    req.user = decoded;
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
