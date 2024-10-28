import express from "express";
import controller from "../controllers/readingController.js";
import {
  registerUser,
  verifyOtp,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

const { getAllReadings, createReading } = controller;

// Reading routes
router.post("/readings", createReading);
router.get("/readings", getAllReadings);

// User routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify", verifyOtp);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
