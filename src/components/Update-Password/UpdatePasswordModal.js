import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/UpdatePasswordModal.css";

const UpdatePasswordModal = ({ onClose }) => {
    const { user, setUser } = useAuth(); // Use setUser to update authentication state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");

            await axios.post("http://localhost:8080/api/auth/update-password", 
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ Fetch new token after password change
            const loginResponse = await axios.post("http://localhost:8080/api/auth/login", 
                { username: user.email, password: newPassword } // Login with new password
            );

            const newToken = loginResponse.data.token;

            // ✅ Update sessionStorage and authentication state
            sessionStorage.setItem("token", newToken);
            setUser({
                ...user,
                token: newToken,
                forcePasswordChange: false, // Ensure modal doesn't show again
            });

            alert("Password updated successfully!");

            // ✅ Close the modal and keep the user logged in
            onClose();

        } catch (err) {
            setError("Error updating password. Please try again.");
            console.error("Update Password Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Reset Your Password</h2>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>Current Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />

                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <label>Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordModal;
