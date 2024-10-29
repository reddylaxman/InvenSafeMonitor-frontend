import User from "../models/user.js";
import bcrypt from "bcrypt";
import { sendOtp } from "../utils/vonage.js";
import { generateToken } from "../utils/jwtUtils.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const getOtpExpiration = () => new Date(Date.now() + 10 * 60 * 1000);

const registerUser = async (req, res) => {
  const {
    clientName,
    username,
    phoneNumber,
    password,
    inventoryType,
    inventoryItems,
  } = req.body;

  console.log("Registering user:", { clientName, username, phoneNumber });

  try {
    const otp = generateOtp();
    const otpExpiration = getOtpExpiration();
    console.log("Generated OTP:", otp);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password for user:", username);

    const newUser = new User({
      clientName,
      username,
      phoneNumber,
      password: hashedPassword,
      inventoryType,
      inventoryItems,
      otp,
      otpExpiration,
    });

    await sendOtp(phoneNumber, otp);
    console.log(`Sent OTP to ${phoneNumber}`);

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully! OTP sent to phone." });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Error creating user" });
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  console.log("Verifying OTP for phone number:", phoneNumber);

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      console.warn("User not found:", phoneNumber);
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      console.warn("Invalid OTP provided:", otp);
      return res.status(401).json({ error: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiration) {
      console.warn("OTP has expired for user:", phoneNumber);
      return res.status(401).json({ error: "OTP has expired" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    console.log("Phone number verified successfully for:", phoneNumber);
    res.status(200).json({ message: "Phone number verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ error: "Error verifying OTP" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log("Logging in user:", username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.warn("User not found for login attempt:", username);
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("Invalid credentials for user:", username);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.verified) {
      console.warn("User phone number not verified:", username);
      return res.status(401).json({ error: "Phone number not verified" });
    }

    const token = generateToken(user._id);
    console.log("Token generated for user:", username);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        clientName: user.clientName,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Error logging in user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Error fetching user" });
  }
};

const updateUserInventory = async (req, res) => {
  const userId = req.params.id;
  const { inventoryType, inventoryItem } = req.body;

  console.log("Updating inventory for user ID:", userId);

  try {
    if (!userId || !inventoryType || typeof inventoryItem !== "string") {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { inventoryType, inventoryItem },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("User inventory updated successfully:", updatedUser);
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user inventory:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User deleted successfully:", req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Error deleting user" });
  }
};

const updateUserSensor = async (req, res) => {
  const userId = req.params.id; // Extract the user ID from the request parameters
  const { sensorId, sensorName } = req.body; // Extract sensor data from the request body

  console.log("Updating sensor for user ID:", userId);

  try {
    // Validate input
    if (!userId || !sensorId || !sensorName) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the sensor already exists
    const existingSensorIndex = user.sensors.findIndex(
      (sensor) => sensor.sensorId === sensorId
    );

    if (existingSensorIndex !== -1) {
      // Update existing sensor
      user.sensors[existingSensorIndex].sensorName = sensorName;
    } else {
      // Add new sensor
      user.sensors.push({ sensorId, sensorName });
    }

    // Save the updated user
    await user.save();

    console.log("User sensor updated successfully:", user);
    return res.status(200).json({ success: true, data: user.sensors });
  } catch (error) {
    console.error("Error updating user sensor:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  registerUser,
  verifyOtp,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserInventory,
  deleteUser,
  updateUserSensor,
};
