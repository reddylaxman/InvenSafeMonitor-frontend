import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/pages/LoginPage";
import RegistrationPage from "./components/pages/SignupPage";
import MyNavbar from "./components/Layouts/MyNavbar";
import HomePage from "./components/Layouts/Home";
import ReadingsList from "./components/readings";
import InventorySelector from "./components/Selector";

const App = () => {
  const token = localStorage.getItem("token"); // Get the token instead of client name

  return (
    <Router>
      <MyNavbar />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              token ? (
                <div className="flex justify-between">
                  {" "}
                  {/* Flexbox container */}
                  <div className="w-1/2 p-2">
                    {" "}
                    {/* InventorySelector takes half width */}
                    <InventorySelector />
                  </div>
                  <div className="w-1/2 p-2">
                    {" "}
                    {/* ReadingsList takes half width */}
                    <ReadingsList />
                  </div>
                </div>
              ) : (
                <HomePage />
              )
            }
          />
          <Route path="/signup" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
