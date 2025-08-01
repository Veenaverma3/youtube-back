 const jwt = require('jsonwebtoken');
 const User = require('../Models/user'); 

const auth = async (req, res, next) => {
  const token = req.cookies.token; // 🔥 Must come from cookies
  console.log("Received token from cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authentication denied" });
  }

  try {
    const decoded = jwt.verify(token, 'veena'); // use your secret
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
