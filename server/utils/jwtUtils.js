// utils/jwtUtils.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET; // Set this in your environment variables

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secretKey, { expiresIn: "1h" }); // Token expires in 1 hour
};

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from authorization header
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = decoded.id; // Store user ID in request for later use
    next();
  });
};
