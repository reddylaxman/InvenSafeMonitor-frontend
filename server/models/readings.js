import mongoose from "mongoose";

const readingSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    required: true,
  },
  sensorName: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: false,
  }
});

const Reading = mongoose.model("Reading", readingSchema);
export default Reading;
