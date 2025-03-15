import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import AddQuestionsForm from "./components/Admin/AddQuestionsForm";
import ExamSetup from "./components/Exam/ExamSetup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./auth/Login";
import ResetPassword from "./auth/ResetPassword";
import SetNewPassword from "./auth/SetNewPassword";
import Register from "./auth/Register";
import { useAuth } from "./context/AuthContext"; 

import "./App.css"; 

const App = () => {
  const auth = useAuth(); 
  const user = auth?.user || {};  // Ensure user is defined

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Default Route - Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Exam & Admin Routes */}
          <Route path="/exam-setup" element={<ExamSetup />} />
          <Route path="/exam" element={<ExamSetup />} />

          {/* Protected Route - Only Accessible to Admins */}
          <Route
            path="/add-questions"
            element={user?.role === "ADMIN" ? <AddQuestionsForm /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
