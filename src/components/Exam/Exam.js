import React, { useState } from "react";
import Timer from "./Timer";
import ExamSummary from "./ExamSummary";
import "./Exam.css";
import Header from "../Header";
import Footer from "../Footer";

const S3_BUCKET_URL = "https://mediq-app.s3.amazonaws.com/question-image/";

const Exam = ({ questions = [], onSubmit, timerDuration }) => {
  const [answers, setAnswers] = useState({});
  const [examCompleted, setExamCompleted] = useState(false);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered questions. Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }
    setExamCompleted(true);
  };

  if (examCompleted) {
    return <ExamSummary questions={questions} answers={answers} />;
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="exam-page">
      <Header />

      {/* Fixed Timer & Progress Bar */}
      <div className="fixed-top-container">
        {timerDuration > 0 && <Timer duration={timerDuration} onTimeout={handleSubmit} />}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              <span className="progress-text">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Exam Content */}
        <div className="exam-container">
          <ul className="exam-questions">
            {questions.map((q, index) => (
              <li key={q.id} className="exam-question">
                {/* Ensure question number and text are inline */}
                <h4 className="exam-question-title">
                  <span className="question-number">{index + 1}. </span>
                  <span className="question-text">{q.question}</span>
                </h4>

                {/* Ensure the image remains inside the container */}
                {q.imageUrl && (
                  <img
                    src={q.imageUrl.startsWith("http") ? q.imageUrl : `${S3_BUCKET_URL}${q.imageUrl}`}
                    alt={`Question ${index + 1}`}
                    className="exam-image"
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      e.target.style.display = "none";
                    }}
                  />
                )}

                <ul className="exam-options">
                  {q.options.map((option) => (
                    <li key={option} className="exam-option">
                      <label className="option-label">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={() => handleAnswerSelect(q.id, option)}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Exam;
