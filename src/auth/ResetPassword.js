import React, { useState } from "react";
import axios from "axios";
import "../styles/ResetPassword.css"; // Custom styles

const ResetPassword = () => {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmailOrUsername(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!emailOrUsername.trim()) {
          alert("Please enter a username or email.");
          return;
        }

        const requestData = emailOrUsername.includes("@") 
            ? { email: emailOrUsername } 
            : { username: emailOrUsername };
    
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);

            const response = await axios.post("http://localhost:8080/api/auth/reset-password", requestData, {
                headers: { "Content-Type": "application/json" },
            });

            setSuccessMessage(response.data);
        } catch (error) {
            setError(error.response?.data || "Error resetting password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h2>Reset Your Password</h2>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email or Username</label>
                        <input
                            type="text"
                            name="emailOrUsername"
                            placeholder="Enter your email or username"
                            value={emailOrUsername}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="reset-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <div className="reset-links">
                    <p>
                        Remembered your password? <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
