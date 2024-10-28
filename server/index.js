import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import readingRoute from "./routes/routes.js";

dotenv.config();
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3133;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const MONGODB_URL="mongodb+srv://reddylaxman:Laxman133@atlascluster.v8zd1xr.mongodb.net/dht22?retryWrites=true&w=majority&appName=AtlasCluster";

const invenSafeMonitor = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("Connection failed");
  }
};

invenSafeMonitor();

app.use("/api", readingRoute);
app.get("/", (req, res) => {
  res.send("Running InvenSafeMonitor Server");
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Failed to connect server");
  } else {
    console.log(`Server started and running on ${PORT}`);
  }
});
