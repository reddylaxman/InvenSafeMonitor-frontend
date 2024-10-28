import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./components/pages/LoginPage";
import RegistrationPage from "./components/pages/SignupPage";
import MyNavbar from "./components/Layouts/MyNavbar";
import HomePage from "./components/Layouts/Home";
import ReadingsList from "./components/readings";

const App = () => {
  const clientName = localStorage.getItem("clientName");
  return (
    <Router>
      <MyNavbar />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={clientName ? <ReadingsList /> : <HomePage />}
          />
          <Route path="/signup" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
