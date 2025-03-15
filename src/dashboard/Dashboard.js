import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaFileAlt, FaUserShield } from "react-icons/fa";
import "../styles/Dashboard.css";
import UpdatePasswordModal from "../components/Update-Password/UpdatePasswordModal"; 

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (user?.forcePasswordChange) {
            setShowModal(true);
        }
    }, [user]); // ✅ React to user updates

    console.log("Current user:", user);

    if (!user) {
        return <p>Loading...</p>;
    }

    const handlePasswordUpdate = () => {
        setShowModal(false);
        logout(); // Log out the user after password change
    };

    return (
        <div className="dashboard-container">
            <h1 className="welcome-message">Welcome {user.firstName}!</h1>

            <div className="dashboard-grid">
                <Link to="/exam-setup" className="dashboard-tile">
                    <FaFileAlt className="tile-icon" />
                    <span className="tile-name">Take Exam</span>
                </Link>

                {user.role === "ADMIN" && (
                    <Link to="/add-questions" className="dashboard-tile">
                        <FaUserShield className="tile-icon" />
                        <span className="tile-name">Admin</span>
                    </Link>
                )}
            </div>

            {showModal && <UpdatePasswordModal onClose={() => setShowModal(false)} onPasswordUpdate={handlePasswordUpdate} />}
        </div>
    );
};

export default Dashboard;
