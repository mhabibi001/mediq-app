import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import AddQuestionsForm from "./components/Admin/AddQuestionsForm";
import ExamSetup from "./components/Exam/ExamSetup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css"; // ✅ Ensure global styles apply

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AddQuestionsForm />} />
            <Route path="/exam" element={<ExamSetup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
