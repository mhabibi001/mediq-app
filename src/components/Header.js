import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Import Home Icon
import "../App.css";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="home-icon">
        <FaHome />
      </Link>
      <h1 className="header-title">MedIQ</h1>
    </header>
  );
};

export default Header;
