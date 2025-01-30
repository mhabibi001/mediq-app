import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import AddQuestionsForm from "./components/Admin/AddQuestionsForm";
import ExamSetup from "./components/Exam/ExamSetup";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AddQuestionsForm />} />
          <Route path="/exam" element={<ExamSetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
