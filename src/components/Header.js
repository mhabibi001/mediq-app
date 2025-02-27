import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import "../styles/Header.css";

const Header = () => {
    const { user, logout } = useContext(AuthContext); // Use AuthContext to check auth status
    const location = useLocation();

    const isAuthenticated = !!user; // ✅ Fix authentication check

    // Hide buttons on login & register pages
    const hideButtons = location.pathname === "/login" || location.pathname === "/register";

    return (
        <header className="header">
            <div className="header-left">
                {isAuthenticated && !hideButtons && (
                    <Link to="/dashboard" className="home-btn">
                        <FaHome className="icon" /> Home
                    </Link>
                )}
            </div>
            <div className="header-center">
                <h1 className="header-title">MedIQ</h1>
            </div>
            <div className="header-right">
                {isAuthenticated && !hideButtons && (
                    <button className="logout-btn" onClick={logout}>
                        <FaSignOutAlt className="icon" /> Logout
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
