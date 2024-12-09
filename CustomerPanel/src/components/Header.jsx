// Header.js
import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function Header() {
  const { isAdmin, handleLogout } = useContext(AuthContext);
  const handleLogOut = () => {
    localStorage.setItem("products", null);
    handleLogout();
  };
  return (
    <header className="bg-base-200 text-base-content shadow-md">
      {" "}
      {/* Updated the class names to match footer */}
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / Admin Section */}
        <div className="text-2xl font-semibold">
          <Link to="/" className="hover:text-gray-400">
            {isAdmin ? "  Admin Dashboard" : "Customer Dashboard"}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/home"
            className="hover:text-gray-400 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/listProducts"
            className="hover:text-gray-400 transition-colors duration-300"
          >
            Product List
          </Link>

          <Link
            to="/addProduct"
            className="hover:text-gray-400 transition-colors duration-300"
          >
            Add Product
          </Link>
          <Link
            to="/cart"
            className="hover:text-gray-400 transition-colors duration-300"
          >
            Cart
          </Link>
        </nav>

        {/* Search and User Profile */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-32 md:w-48 rounded-lg text-black"
            />
          </div>

          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:bg-gray-700"
            >
              <div className="w-10 rounded-full border-2 border-gray-500">
                <img
                  alt="Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box mt-3 w-52 p-2 shadow-lg text-base-content"
            >
              <li>
                <a className="hover:bg-gray-600">
                  Profile
                  <span className="badge bg-blue-500 text-white ml-2">New</span>
                </a>
              </li>
              <li>
                <a className="hover:bg-gray-600">Settings</a>
              </li>
              <li>
                <a onClick={handleLogOut} className="hover:bg-gray-600">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
