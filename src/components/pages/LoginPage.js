import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", // Ensure the username field is initialized
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:3133/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        // Check for status 200 for success
        if (res.status === 200) {
          return res.json();
        } else {
          // Handle non-200 responses
          return res.json().then((data) => {
            throw new Error(data.error || "Invalid username or password!");
          });
        }
      })
      .then((data) => {
        // Check if login was successful using a specific response property
        if (data.user) {
          // Check if the user object exists in the response
          // Store the token in local storage
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", formData.username); // Store username
          localStorage.setItem("clientName", data.user.clientName); // Store client name
          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/");
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }
          });
        } else {
          // Show error message for invalid credentials
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid username or password!",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message || "Something went wrong!",
        });
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="bg-white p-8 shadow-md w-full max-w-sm"
        style={{ marginTop: "-150px" }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
          <div className="text-center">
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
