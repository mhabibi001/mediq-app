import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Exam from "./Exam";
import "../../styles/ExamSetup.css";

const ExamSetup = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCount, setSelectedCount] = useState("");
  const [maxQuestions, setMaxQuestions] = useState(0);
  const [timerDuration, setTimerDuration] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (location.state?.resetExam) {
      console.log("Resetting Exam State...");
      setExamStarted(false);
      setSelectedCategory("");
      setSelectedCount("");
      setTimerDuration(null);
      setQuestions([]);
  
      navigate("/exam", { replace: true, state: {} });
    }
  }, [location.state, navigate]);
  
  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Retrieve JWT token
        if (!token) {
          console.error("No authentication token found.");
          return;
        }
  
        const response = await fetch("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` }, // Attach token in the request
        });
  
        if (!response.ok) throw new Error("Failed to fetch categories");
  
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchQuestionCount = async () => {
        if (!selectedCategory) return;

        try {
            console.log(`Fetching question count for category: ${selectedCategory}`); // Debugging

            const token = sessionStorage.getItem("token");
            if (!token) {
                console.error("No authentication token found.");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/exam/questions/count?categoryId=${selectedCategory}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch question count: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched question count data:", data); // Debugging

            const count = data.count || 0;
            setMaxQuestions(count);

            // Ensure that if only a small number of questions exist, the dropdown updates accordingly
            if (count > 0 && count <= 10) {
                setSelectedCount(count.toString());
            }

        } catch (error) {
            console.error("Error fetching question count:", error);
        }
    };

    fetchQuestionCount();
}, [selectedCategory]);


  const handleStartExam = async () => {
    if (!selectedCategory || !selectedCount) {
      alert("Please select a category and question count.");
      return;
    }
  
    try {
      const token = sessionStorage.getItem("token"); // Retrieve JWT token
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
  
      const response = await fetch(
        `http://localhost:8080/api/exam/questions?categoryId=${selectedCategory}&count=${selectedCount}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      if (!response.ok) throw new Error(`Failed to load questions: ${response.status}`);
  
      const data = await response.json();
      setQuestions(data);
      setExamStarted(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Error fetching questions.");
    }
  };

  return (
    <div className={`exam-setup-wrapper ${!examStarted ? "exam-setup-visible" : ""}`}>
      <div className="exam-setup-container">
        {!examStarted ? (
          <>
            <h2 className="setup-title">Exam Configuration</h2>

            {/* Select Category */}
            <div className="form-group">
              <label>Select Category:</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading categories...</option>
                )}
              </select>
            </div>

            {/* Select Number of Questions */}
            <div className="form-group">
                <label>Number of Questions:</label>
                <select
                    value={selectedCount}
                    onChange={(e) => setSelectedCount(e.target.value)}
                    disabled={!selectedCategory || maxQuestions === 0}
                >
                    <option value="">Select number of questions</option>
                    {maxQuestions > 0 ? (
                        Array.from({ length: Math.ceil(maxQuestions / 10) }, (_, i) => (i + 1) * 10).map((num) => (
                            <option key={num} value={num}>
                                {num > maxQuestions ? maxQuestions : num} {/* Adjusts if maxQuestions is not a multiple of 10 */}
                            </option>
                        ))
                    ) : (
                        <option disabled>No questions available</option>
                    )}
                </select>
            </div>


            {/* Select Timer Duration */}
            <div className="form-group">
              <label>Timer Duration:</label>
              <select 
                value={timerDuration || ""}
                onChange={(e) => setTimerDuration(e.target.value ? Number(e.target.value) : null)} 
              >
                <option value="">No Timer</option>
                {Array.from({ length: 6 }, (_, i) => (i + 1) * 10).map((num) => (
                  <option key={num} value={num}>
                    {num} Minutes
                  </option>
                ))}
              </select>
            </div>

            {/* Start Exam Button */}
            <button className="start-exam-button" onClick={handleStartExam} disabled={!selectedCategory || !selectedCount}>
              Start Exam
            </button>
          </>
        ) : (
          <Exam questions={questions} onSubmit={() => setExamStarted(false)} timerDuration={timerDuration} />
        )}
      </div>
    </div>
  );
};

export default ExamSetup;
