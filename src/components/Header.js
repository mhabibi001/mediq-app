import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo512.png";

const Header = () => {
  return (
    <header className="header">
      {/* Left Section: Logo + MedIQ Name */}
      <div className="header-left">
        <img src={logo} alt="MedIQ Logo" className="logo-image" />
        <h1 className="logo-text">MedIQ</h1>
      </div>

      {/* Centered Navigation */}
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/exam"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              Exam
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
