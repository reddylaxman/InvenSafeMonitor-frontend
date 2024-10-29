// controllers/inventoryController.js

import inventoryData from "../data/inventoryData.js"; // Update the path to your inventory data

// Controller function to get all inventory data
const getAllInventory = (req, res) => {
  if (!inventoryData || Object.keys(inventoryData).length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "No inventory data found." });
  }

  res.status(200).json({ success: true, data: inventoryData });
};

export default getAllInventory;
