import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import Swal from "sweetalert2";

const MyNavbar = () => {
  const token = localStorage.getItem("token");
  const clientName = localStorage.getItem("clientName");
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("clientName");
        localStorage.removeItem("id");
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  };

  return (
    <div>
      <Navbar className="bg-white shadow-md p-4 justify-between">
        <Navbar.Brand as={Link} to="/" className="flex items-center">
          <span className="text-blue-500">
            <b>InvenSafe</b>
          </span>
          <b> Monitor</b>
        </Navbar.Brand>

        <div className="flex items-center space-x-4 ml-auto">
          {token ? (
            <div className="flex items-center relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6OsEdiEgdaXSU8q7MEJwpmM9QJLoa4CLtw&s"
                alt="Profile"
                className="w-12 h-12 rounded-full mr-2"
              />
              <select
                onChange={handleLogout}
                className="w-48 h-10 px-2 py-1 bg-white text-base focus:outline-none text-lg"
              >
                <option value="" disabled selected hidden>
                  {clientName}
                </option>
                <option
                  value="logout"
                  className="bg-white text-black text-sm cursor-pointer"
                >
                  Logout
                </option>
              </select>
            </div>
          ) : (
            <div className="flex items-center">
              <Nav.Link
                as={Link}
                to="/login"
                className="text-blue-500 hover:text-blue-700"
              >
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-2">
                  Sign Up
                </button>
              </Nav.Link>
            </div>
          )}
        </div>
      </Navbar>
    </div>
  );
};

export default MyNavbar;
