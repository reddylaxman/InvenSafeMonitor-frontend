import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiration: {
    type: Date,
    default: null,
  },
  sensors: [
    {
      sensorId: {
        type: String,
        required: true,
      },
      sensorName: {
        type: String,
        required: true,
      },
    },
  ],
  inventoryType: {
    type: String,
    required: true,
  },
  inventoryItems: [
    {
      itemName: {
        type: String,
        required: true,
      },
    },
  ],
  isAnomalyDetected: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
