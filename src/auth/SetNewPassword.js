import React, { useState } from "react";
import axios from "axios";

const SetNewPassword = () => {
    const [formData, setFormData] = useState({ email: "", oldPassword: "", newPassword: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/auth/update-password", formData);
            alert("Password updated successfully!");
        } catch (error) {
            alert("Failed to update password.");
        }
    };

    return (
        <div>
            <h2>Set New Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="oldPassword" placeholder="Old Password" onChange={handleChange} required />
                <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} required />
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
};

export default SetNewPassword;
