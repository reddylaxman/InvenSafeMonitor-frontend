import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ReadingsList = () => {
  const [readings, setReadings] = useState([]); // Store all readings
  const [latestReading, setLatestReading] = useState(null); // Store the latest reading
  const [loading, setLoading] = useState(true);

  const fetchReadings = async () => {
    try {
      const response = await fetch("http://localhost:3133/api/readings");
      if (!response.ok) {
        throw new Error("Failed to fetch readings.");
      }
      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching readings:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to fetch readings!",
      });
      return [];
    }
  };

  useEffect(() => {
    const fetchAndSetReadings = async () => {
      const fetchedReadings = await fetchReadings();
      if (fetchedReadings.length > 0) {
        setReadings(fetchedReadings);

        // Find the latest reading based on the timestamp
        const latest = fetchedReadings.reduce((latest, reading) =>
          new Date(reading.timestamp) > new Date(latest.timestamp)
            ? reading
            : latest
        );
        setLatestReading(latest);
      }
      setLoading(false);
    };

    fetchAndSetReadings();
  }, []); // Only fetch on mount

  // Check for updates on reload
  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedReadings = await fetchReadings();
      if (fetchedReadings.length > 0) {
        setReadings(fetchedReadings);

        // Update latest reading if it has changed
        const latest = fetchedReadings.reduce((latest, reading) =>
          new Date(reading.timestamp) > new Date(latest.timestamp)
            ? reading
            : latest
        );

        // Only update state if the latest reading has changed
        if (!latestReading || latest._id !== latestReading._id) {
          setLatestReading(latest);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [latestReading]); // Depend on latestReading

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Latest Reading</h2>
      {latestReading ? ( // Display the latest reading
        <div className="mb-6 p-4 border rounded-md shadow">
          <h3 className="font-semibold">Latest Reading</h3>
          <p>
            <strong>Sensor ID:</strong> {latestReading.sensorId}
          </p>
          <p>
            <strong>Sensor Name:</strong> {latestReading.sensorName}
          </p>
          <p>
            <strong>Temperature:</strong> {latestReading.temperature} °C
          </p>
          <p>
            <strong>Humidity:</strong> {latestReading.humidity} %
          </p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(latestReading.timestamp).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>No readings found.</p>
      )}
    </div>
  );
};

export default ReadingsList;
// <h2 className="text-lg font-semibold mb-4">All Readings</h2>
//       {readings.length > 0 ? (
//         <ul className="space-y-4">
//           {readings.map((reading) => (
//             <li key={reading._id} className="p-4 border rounded-md shadow">
//               <p>
//                 <strong>Sensor ID:</strong> {reading.sensorId}
//               </p>
//               <p>
//                 <strong>Sensor Name:</strong> {reading.sensorName}
//               </p>
//               <p>
//                 <strong>Temperature:</strong> {reading.temperature} °C
//               </p>
//               <p>
//                 <strong>Humidity:</strong> {reading.humidity} %
//               </p>
//               <p>
//                 <strong>Timestamp:</strong>{" "}
//                 {new Date(reading.timestamp).toLocaleString()}
//               </p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No readings found.</p>
//       )}
