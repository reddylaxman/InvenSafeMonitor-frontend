
import Reading from "../models/readings.js";
import dotenv from "dotenv";
dotenv.config();

const createReading = async (req, res) => {
  const body = req.body;

  try {
    if (
      !body.sensorId ||
      !body.sensorName ||
      !body.temperature ||
      !body.humidity
    ) {
      return res.status(400).json({
        error:
          "Sensor ID, sensor name, temperature, and humidity are required.",
      });
    }

    const newReading = new Reading(body);
    const savedReading = await newReading.save();

    return res.status(201).json({
      id: savedReading._id,
      message: "Readings added successfully.",
      reading: savedReading,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const getAllReadings = async (req, res) => {
  try {
    const readings = await Reading.find();
    return res.status(200).json(readings);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      error: "An error occurred while fetching readings.",
    });
  }
};

export default { createReading, getAllReadings };
