import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // ✅ Separate Header CSS file

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">MedIQ</h1>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-item">Home</Link>
            </li>
            <li>
              <Link to="/admin" className="nav-item">Admin</Link>
            </li>
            <li>
              <Link to="/exam" className="nav-item">Exam</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
