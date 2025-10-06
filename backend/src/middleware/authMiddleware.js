const jwt = require("jsonwebtoken");
const { User } = require("../db/schema.js");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ error: "User not found" });
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
