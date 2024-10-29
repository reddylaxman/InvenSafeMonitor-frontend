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

const getLastReading = async (req, res) => {
  const { sensorId } = req.query; // Expecting sensorId in query params

  try {
    // Default to ISM-RT-1 if no sensorId is provided
    const sensorIdToFetch = sensorId || "ISM-RT-1";

    // Fetch the last reading for the specified sensor ID
    const lastReading = await Reading.findOne({ sensorId: sensorIdToFetch })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .exec(); // Execute the query

    if (!lastReading) {
      return res.status(404).json({
        message: "No readings found for the specified sensor ID.",
      });
    }

    return res.status(200).json(lastReading);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      error: "An error occurred while fetching the last reading.",
    });
  }
};

export default { createReading, getAllReadings, getLastReading };
