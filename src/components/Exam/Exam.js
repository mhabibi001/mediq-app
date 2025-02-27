import React, { useState } from "react";
import Timer from "./Timer";
import ExamSummary from "./ExamSummary";
import "../../styles/Exam.css";
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
    <div className="exam-page-container">
      {/* Fixed Header */}
      <Header />

      {/* Fixed Progress Bar Below Header */}
      <div className="exam-progress-wrapper">
        <div className="exam-progress-container">
          <div className="exam-progress-bar">
            <div className="exam-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          {timerDuration > 0 && (
            <span className="exam-timer">
              <Timer duration={timerDuration} onTimeout={handleSubmit} />
            </span>
          )}
        </div>
      </div>

      {/* Exam Content Below Progress Bar */}
      <div className="exam-content-wrapper">
        <div className="exam-questions-container">
          <ul className="exam-questions-list">
            {questions.map((q, index) => (
              <li key={q.id} className="exam-question-item">
                <h4 className="exam-question-title">
                  <span className="exam-question-number">{index + 1}. </span>
                  <span className="exam-question-text">{q.question}</span>
                </h4>

                {q.imageUrl && (
                  <img
                    src={q.imageUrl.startsWith("http") ? q.imageUrl : `${S3_BUCKET_URL}${q.imageUrl}`}
                    alt={`Question ${index + 1}`}
                    className="exam-question-image"
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      e.target.style.display = "none";
                    }}
                  />
                )}

                <ul className="exam-answer-options">
                  {q.options.map((option) => (
                    <li key={option} className="exam-answer-option">
                      <label className="exam-answer-label">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={() => handleAnswerSelect(q.id, option)}
                        />
                        <span className="exam-answer-text">{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button className="exam-submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Exam;
