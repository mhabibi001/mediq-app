import React, { useState, useEffect } from "react";
import { fetchQuestions, getCategories, getQuestionCount } from "../../utils/ApiService";
import Timer from "./Timer";
import "../../App.css";

const ExamSetup = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [questionCountOptions, setQuestionCountOptions] = useState([]);
  const [selectedCount, setSelectedCount] = useState("");
  const [timer, setTimer] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [gradedQuestions, setGradedQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
        alert("Failed to load categories.");
      }
    };
    loadCategories();
  }, []);

  const loadQuestionCounts = async (id) => {
    try {
      if (!id) {
        setQuestionCountOptions([]);
        return;
      }
      const response = await getQuestionCount(id);
      const count = response.data.count;
      const options = [];
      for (let i = 10; i <= count; i += 10) options.push(i);
      if (count % 10 !== 0) options.push(count);
      setQuestionCountOptions(options);
    } catch (error) {
      console.error("Error loading question counts:", error);
      setQuestionCountOptions([]);
    }
  };

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    setCategoryId(id);
    loadQuestionCounts(id);
  };

  const startExam = async () => {
    try {
      const data = await fetchQuestions(categoryId, selectedCount);
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setTimeRemaining(timer === "None" ? 0 : parseInt(timer, 10) * 60);
      } else {
        alert("No questions available for the selected category.");
      }
    } catch (error) {
      console.error("Error starting the exam:", error);
      alert("Failed to load questions. Please try again.");
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    // Find unanswered questions
    const unansweredQuestions = questions.filter((q) => !answers[q.id]);
  
    if (unansweredQuestions.length > 0) {
      const confirmation = window.confirm(
        `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`
      );
  
      if (!confirmation) {
        return; // Exit if the user cancels
      }
    }
  
    // Grade the exam
    const graded = questions.map((q) => ({
      ...q,
      isCorrect: answers[q.id] === q.rightAnswer,
    }));
    setGradedQuestions(graded);
    setShowSummary(true);
  };
  

  const handleTimeout = () => {
    alert("Time's up! Auto-submitting the exam.");
    handleSubmit();
  };

  if (showSummary) {
    const totalCorrect = gradedQuestions.filter((q) => q.isCorrect).length;
    const grade = ((totalCorrect / gradedQuestions.length) * 100).toFixed(2);
  
    return (
      <div>
        <h2>Exam Summary</h2>
        <h3>Your Grade: {grade}%</h3>
        <ul>
          {gradedQuestions.map((q) => (
            <li key={q.id} className="exam-summary">
              <h4>{q.question}</h4>
              <p>
                <strong>Your Answer: </strong>
                <span
                  className={q.isCorrect ? "correct-answer" : "incorrect-answer"}
                >
                  {answers[q.id]}
                </span>
                <span
                  className={`badge ${
                    q.isCorrect ? "badge-correct" : "badge-incorrect"
                  }`}
                >
                  {q.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </p>
              <p>
                <strong>Justification: </strong>
                {q.justification}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  

  return (
    <div className="exam-container">
      {questions.length === 0 ? (
  <div className="exam-container">
    <h2>Configure Your Test</h2>
    <div className="form-group">
      <label htmlFor="category">Category:</label>
      <select id="category" onChange={handleCategoryChange} value={categoryId}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="questionCount">Number of Questions:</label>
      <select
        id="questionCount"
        onChange={(e) => setSelectedCount(e.target.value)}
        value={selectedCount}
        disabled={!questionCountOptions.length}
      >
        <option value="">Select Count</option>
        {questionCountOptions.map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="timer">Timer:</label>
      <select id="timer" onChange={(e) => setTimer(e.target.value)} value={timer}>
        <option value="None">No Timer</option>
        <option value="15">15 minutes</option>
        <option value="30">30 minutes</option>
        <option value="45">45 minutes</option>
        <option value="60">1 hour</option>
      </select>
    </div>
    <button onClick={startExam}>Start Exam</button>
  </div>
) : (
  <div className="exam-container">
    {timeRemaining > 0 && <Timer duration={timeRemaining} onTimeout={handleTimeout} />}
    <ul>
      {questions.map((q) => (
        <li key={q.id} className="exam-question">
          <h4>{q.question}</h4>
          <ul>
            {q.options.map((option) => (
              <li key={option}>
                <label>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleAnswerSelect(q.id, option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
    <button onClick={handleSubmit}>Submit</button>
  </div>
)}
    </div>
  );
};

export default ExamSetup;
