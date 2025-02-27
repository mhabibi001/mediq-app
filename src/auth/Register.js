import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        institution: "",
        educationLevelId: "",
        timeZoneId: "",
        examCategoryIds: [],
        agreedToTerms: false,
        profilePicture: null,
    });

    const [educationLevels, setEducationLevels] = useState([]);
    const [timeZones, setTimeZones] = useState([]);
    const [examCategories, setExamCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch dropdown values
        const fetchData = async () => {
            try {
                const [eduResponse, timeResponse, examResponse] = await Promise.all([
                    axios.get("http://localhost:8080/api/education-levels"),
                    axios.get("http://localhost:8080/api/timezones"),
                    axios.get("http://localhost:8080/api/exam-categories"),
                ]);

                setEducationLevels(eduResponse.data);
                setTimeZones(timeResponse.data);
                setExamCategories(examResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            setFormData({ ...formData, profilePicture: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleMultiSelectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ ...formData, examCategoryIds: selectedOptions });
    };

    const [success, setSuccess] = useState(null); // New state for success message


    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        const userPayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            institution: formData.institution,
            educationLevelId: formData.educationLevelId,
            timeZoneId: formData.timeZoneId,
            examCategoryIds: formData.examCategoryIds.map(Number),
            agreedToTerms: formData.agreedToTerms,
        };

        const formDataPayload = new FormData();
        formDataPayload.append("user", JSON.stringify(userPayload));
        if (formData.profilePicture) {
            formDataPayload.append("profilePicture", formData.profilePicture);
        }

        try {
            await axios.post("http://localhost:8080/api/auth/register", formDataPayload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setLoading(false);
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
        } catch (error) {
            setLoading(false);
            setError("Registration failed. Please try again.");
        }
    };   

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Register for MedIQ</h2>
                {success && <div className="success-message">{success}</div>}
                {/* ✅ Show error message if registration fails */}
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <div className="form-row">
                            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                        <input type="text" name="institution" placeholder="Institution" value={formData.institution} onChange={handleChange} required />
    
                        <select name="educationLevelId" value={formData.educationLevelId} onChange={handleChange} required>
                            <option value="">Select Education Level</option>
                            {educationLevels.map((level) => (
                                <option key={level.id} value={level.id}>{level.name}</option>
                            ))}
                        </select>
    
                        <select name="timeZoneId" value={formData.timeZoneId} onChange={handleChange} required>
                            <option value="">Select Time Zone</option>
                            {timeZones.map((zone) => (
                                <option key={zone.id} value={zone.id}>{zone.name}</option>
                            ))}
                        </select>
    
                        <label className="form-label">Study Category</label>
                        <select 
                            multiple 
                            name="examCategoryIds" 
                            value={formData.examCategoryIds} 
                            onChange={handleMultiSelectChange} 
                            required
                            className="multi-select"
                        >
                            {examCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <label className="form-label">Profile Picture</label>
                        <input type="file" name="profilePicture" onChange={handleChange} className="file-input" />
                        <label className="form-label">Terms and Conditions</label>
                        <div className="terms-box">
                            <p><strong>Last Updated: February 24, 2025</strong></p>
                            <p>By signing up for MedIQ, you agree to the following Terms and Conditions. Please read carefully.</p>
                            <p><strong>1. Acceptance of Terms</strong> - By creating an account, you agree to our Terms and Privacy Policy.</p>
                            <p><strong>2. User Eligibility</strong> - You must be at least 13 years old to use MedIQ.</p>
                            <p><strong>3. Account Security</strong> - You are responsible for keeping your login details safe.</p>
                            <p><strong>4. Acceptable Use</strong> - You agree to use MedIQ respectfully and legally.</p>
                            <p><strong>5. Privacy Policy</strong> - Your data is handled according to our Privacy Policy.</p>
                            <p><strong>6. Contact</strong> - For questions, email us at <a href="mailto:mhabibi@quantumxgroup.com">mhabibi@quantumxgroup.com</a>.</p>
                        </div>

                        <div className="checkbox-group">
                        <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} required />
                        <label>I agree to the Terms and Conditions</label>
                    </div>


    
                        <button type="submit" className="register-btn" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
    
                <p className="login-link">Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
            </div>
        </div>
    );    
};

export default Register;
