import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Ensure styles apply

const Home = () => {
  return (
    <div className="home-container">
      <h2>Welcome to MedIQ</h2>
      <p>Select an option to get started:</p>

      <div className="module-options">
        <Link to="/admin" className="module-card">
          <h3>Admin Panel</h3>
          <p>Add and manage questions.</p>
        </Link>

        <Link to="/exam" className="module-card">
          <h3>Take Exam</h3>
          <p>Start a test and assess your knowledge.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
