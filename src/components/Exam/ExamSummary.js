import React, { useEffect } from "react";
import "./ExamSummary.css";
import { useNavigate } from "react-router-dom";

const S3_BUCKET_URL = "https://mediq-app.s3.amazonaws.com/";

const ExamSummary = ({ questions = [], answers = {} }) => { 
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!questions.length) {
    return <p>Error: No questions available. Please restart the exam.</p>;
  }

  const score = questions.filter(q => answers[q.id] === q.rightAnswer).length;
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

  return (
    <div className="exam-summary-container">
      
      {/* Top Buttons */}
      <div className="exam-summary-actions top-buttons">
        <button className="exit-button" onClick={() => navigate("/")}>Exit</button>
      </div>

      <h2 className="exam-summary-title">Exam Summary</h2>
      <p className="exam-summary-score">Your Score: {score} / {totalQuestions} ({percentage}%)</p>

      <ul className="exam-summary-list">
        {questions.map(q => {
          const isCorrect = answers[q.id] === q.rightAnswer;

          return (
            <li key={q.id} className="exam-summary-item">
              <h4>
                {q.question} 
                {answers[q.id] ? (
                  isCorrect ? <span className="correct-badge">✅ Correct</span> : <span className="incorrect-badge">❌ Incorrect</span>
                ) : (
                  <span className="unanswered-badge">⚠️ Not Answered</span>
                )}
              </h4>

              {q.imageUrl && (
                <img
                  src={q.imageUrl.startsWith("http") ? q.imageUrl : `${S3_BUCKET_URL}${q.imageUrl}`}
                  alt="Question"
                  className="exam-summary-image"
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src);
                    e.target.style.display = "none";
                  }}
                />
              )}

              <p><strong>Your Answer:</strong> {answers[q.id] || "Not Answered"}</p>
              <p><strong>Correct Answer:</strong> {q.rightAnswer}</p>

              {q.justification && (
                <p className="justification"><strong>Justification:</strong> {q.justification}</p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Bottom Buttons */}
      <div className="exam-summary-actions bottom-buttons">
        <button className="exit-button" onClick={() => navigate("/")}>Exit</button>
      </div>
    </div>
  );
};

export default ExamSummary;
