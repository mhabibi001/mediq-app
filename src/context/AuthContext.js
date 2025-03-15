import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token"); // Store in sessionStorage
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
        setLoading(false);

        const checkTokenExpiry = () => {
            const token = sessionStorage.getItem("token");
            if (!token) return;
    
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.error("🚨 JWT expired, logging out...");
                    sessionStorage.removeItem("token");
                    window.location.href = "/login";  
                }
            } catch (error) {
                console.error("Error decoding JWT:", error);
            }
        };
    
        checkTokenExpiry();
        const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000); 
        return () => clearInterval(interval);

    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", credentials);
            const { token, role } = response.data;
            sessionStorage.setItem("token", token);
    
            // Decode JWT to store user data
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded); 
    
            // Store user details including firstName and role
            setUser({
                email: decoded.sub,
                role: role || decoded.role,
                firstName: decoded.firstName || "User",  // ✅ Ensure firstName is stored properly
                forcePasswordChange: decoded.forcePasswordChange || false,  // ✅ Include this
            });
    
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error", error);
            throw error;
        }
    };
    

    const logout = () => {
        sessionStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
