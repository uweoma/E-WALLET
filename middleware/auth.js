const jwt = require("jsonwebtoken");
const User = require("../models/User");


const validateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};


const checkUser = async (req, res, next) => {
  const userId = req.user;
  if (!userId) return res.status(401).json({ message: "Access Denied" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  validateToken,
  checkUser,
};