import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddQuestionForm from "./components/Admin/AddQuestionsForm";
import ExamSetup from "./components/Exam/ExamSetup";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Welcome to MedIQ</h1>
        <nav>
          <Link to="/admin">Admin</Link> | <Link to="/exam">Exam</Link>
        </nav>
        <Routes>
          <Route path="/admin" element={<AddQuestionForm />} />
          <Route path="/exam" element={<ExamSetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;