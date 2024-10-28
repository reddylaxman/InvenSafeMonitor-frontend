import User from "../models/user.js";
import bcrypt from "bcrypt";
import { sendOtp } from "../utils/vonage.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const getOtpExpiration = () => new Date(Date.now() + 10 * 60 * 1000);

const registerUser = async (req, res) => {
  const { clientName, phoneNumber, inventoryType, inventoryItems } = req.body;

  try {
    const newUser = new User({
      clientName,
      phoneNumber,
      inventoryType,
      inventoryItems,
    });

    const otp = generateOtp();
    newUser.otp = otp;
    newUser.otpExpiration = getOtpExpiration();
    await sendOtp(phoneNumber, otp);
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

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiration) {
      return res.status(401).json({ error: "OTP has expired" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Phone number verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ error: "Error verifying OTP" });
  }
};

const loginUser = async (req, res) => {
  const { clientName, password } = req.body;

  try {
    const user = await User.findOne({ clientName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(401).json({ error: "Phone number not verified" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        clientName: user.clientName,
        phoneNumber: user.phoneNumber,
        inventoryType: user.inventoryType,
        inventoryItems: user.inventoryItems,
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
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Error fetching user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Error deleting user" });
  }
};

export {
  registerUser,
  verifyOtp,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
