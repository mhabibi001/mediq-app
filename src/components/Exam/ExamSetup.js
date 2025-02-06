import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Exam from "./Exam";
import "./Exam.css";

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

  // ✅ Reset exam when retaking
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
    fetch("http://localhost:8080/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // ✅ Fetch max questions for selected category
  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:8080/api/exam/questions/count?categoryId=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          const count = data.count || 0;
          setMaxQuestions(count);

          // ✅ Prepopulate if only one option is available
          if (count > 0 && count <= 10) {
            setSelectedCount(count.toString());
          }
        })
        .catch((error) => console.error("Error fetching question count:", error));
    }
  }, [selectedCategory]);

  // ✅ Generate options for question count (increment by 10, last option is max)
  const getQuestionOptions = () => {
    const options = [];
    for (let i = 10; i <= maxQuestions; i += 10) {
      options.push(i);
    }
    if (maxQuestions > 0 && !options.includes(maxQuestions)) {
      options.push(maxQuestions);
    }
    return options;
  };

  // ✅ Timer options (10-60 mins, or "No Timer")
  const getTimerOptions = () => {
    const options = [{ value: null, label: "No Timer" }];
    for (let i = 10; i <= 60; i += 10) {
      options.push({ value: i, label: `${i} Minutes` });
    }
    return options;
  };

  const handleStartExam = async () => {
    if (!selectedCategory || !selectedCount) {
      alert("Please select a category and question count.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/exam/questions?categoryId=${selectedCategory}&count=${selectedCount}`
      );
      if (!response.ok) throw new Error("Failed to load questions.");
      const data = await response.json();
      setQuestions(data);
      setExamStarted(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Error fetching questions.");
    }
  };

  return (
    <div className="exam-setup-wrapper">
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
                {getQuestionOptions().map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Timer Duration */}
            <div className="form-group">
              <label>Timer Duration:</label>
              <select 
                value={timerDuration || ""}
                onChange={(e) => setTimerDuration(e.target.value ? Number(e.target.value) : null)} 
              >
                {getTimerOptions().map((option) => (
                  <option key={option.value} value={option.value || ""}>
                    {option.label}
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
