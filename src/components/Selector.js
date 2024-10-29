import React, { useEffect, useState } from "react";

const InventorySelector = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialSelection, setInitialSelection] = useState({
    type: "",
    item: "",
  });
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [isEditable, setIsEditable] = useState(false); // State for controlling edit mode

  // Fetch ID from localStorage once when the component mounts
  useEffect(() => {
    const fetchedId = localStorage.getItem("id");
    setId(fetchedId);
  }, []);

  useEffect(() => {
    // Fetch inventory data
    const fetchInventoryData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:3133/api/inventory");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setInventoryData(data.data);
        } else {
          throw new Error("Failed to fetch inventory data");
        }
      } catch (error) {
        setError("Error fetching inventory data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  useEffect(() => {
    // Fetch the current selection from the database using the ID if needed
    const fetchCurrentSelection = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:3133/api/users/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data) {
            setSelectedType(data.inventoryType);
            setSelectedItem(data.inventoryItem || "");
            setInitialSelection({
              type: data.inventoryType,
              item: data.inventoryItem || "",
            });
          }
        } catch (error) {
          setError("Error fetching current selection: " + error.message);
        }
      }
    };

    fetchCurrentSelection();
  }, [id]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setSelectedItem(""); // Reset selected item when type changes
  };

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const saveSelection = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:3133/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryType: selectedType,
          inventoryItem: selectedItem || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Inventory updated successfully!");
      setInitialSelection({
        type: selectedType,
        item: selectedItem,
      });
      setIsEditable(false); // Disable editing after saving
    } catch (error) {
      console.error("Error updating inventory:", error.message);
      setError("Error updating inventory: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditable(true); // Enable editing
  };

  const handleCancel = () => {
    setIsEditable(false); // Disable editing and revert to initial selection
    setSelectedType(initialSelection.type);
    setSelectedItem(initialSelection.item);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded-lg  bg-white">
      <h1 className="text-2xl font-bold text-center mb-5">
        Select Inventory Type and Item
      </h1>

      {loading && (
        <p className="text-center text-blue-600">Loading inventory data...</p>
      )}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {inventoryData && !loading && (
        <div>
          <label
            htmlFor="inventory-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selected Inventory Type:
          </label>
          <select
            id="inventory-type"
            value={selectedType}
            onChange={handleTypeChange}
            disabled={!isEditable} // Disable if not editable
            className={`block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 ${
              !isEditable ? "bg-gray-200" : ""
            }`}
          >
            <option value="">--Select Type--</option>
            {Object.keys(inventoryData).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label
            htmlFor="inventory-item"
            className="block text-sm font-medium text-gray-700 mb-1 mt-4"
          >
            Selected Inventory Item:
          </label>
          <select
            id="inventory-item"
            value={selectedItem}
            onChange={handleItemChange}
            disabled={!isEditable} // Disable if not editable
            className={`block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 ${
              !isEditable ? "bg-gray-200" : ""
            }`}
          >
            <option value="">--Select Item--</option>
            {inventoryData[selectedType] &&
              inventoryData[selectedType].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>

          {!isEditable && (
            <button
              onClick={handleEdit}
              className="mt-4 p-2 bg-blue-600 text-white rounded-md"
            >
              Select Inventory
            </button>
          )}

          {isEditable && (
            <div className="flex justify-between mt-4">
              <button
                onClick={saveSelection}
                className={`p-2 rounded-md ${
                  selectedType && selectedItem && !saving
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!selectedType || !selectedItem || saving}
              >
                {saving ? "Saving..." : "Save Selection"}
              </button>

              <button
                onClick={handleCancel}
                className="ml-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventorySelector;
