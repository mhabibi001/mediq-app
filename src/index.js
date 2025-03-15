import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // ✅ Import Router
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router> {/* ✅ Wrap everything inside Router FIRST */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);


reportWebVitals();
