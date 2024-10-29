import express from "express";
import controller from "../controllers/readingController.js";
import {
  registerUser,
  verifyOtp,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserInventory,
  updateUserSensor,
} from "../controllers/userController.js";
import getAllInventory from "../controllers/dataController.js";

const router = express.Router();

const { getAllReadings, createReading, getLastReading } = controller;

// Reading routes
router.post("/readings", createReading);
router.get("/readings", getAllReadings);
router.get("/lastReading", getLastReading);
router.get("/inventory", getAllInventory);
// User routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify", verifyOtp);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserInventory);
router.put("/users/sensor/:id", updateUserSensor);
router.delete("/users/:id", deleteUser);

export default router;
