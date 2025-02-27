import React, { useEffect } from "react";
import "../../styles/ExamSummary.css";
import { useNavigate } from "react-router-dom";

const ExamSummary = ({ questions = [], answers = {} }) => { 
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!questions.length) {
    return <p className="error-message">Error: No questions available. Please restart the exam.</p>;
  }

  const score = questions.filter(q => answers[q.id] === q.rightAnswer).length;
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(2) : 0;

  return (
    <div className="exam-summary-page">
      <div className="exam-summary-container">

        {/* Title & Score */}
        <h2 className="exam-summary-title">Exam Summary</h2>
        <p className="exam-summary-score">Your Score: {score} / {totalQuestions} ({percentage}%)</p>

        {/* Top Buttons */}
        <div className="exam-summary-actions">
          <button className="retake-button" onClick={() => navigate("/exam", { state: { resetExam: true } })}>
            Retake Exam
          </button>
          <button className="exit-button" onClick={() => navigate("/")}>Exit</button>
        </div>

        {/* Summary Content - Scrollable */}
        <div className="exam-summary-content">
          <ul className="exam-summary-list">
            {questions.map(q => {
              let justificationImageUrl = q.justificationImageUrl;
              if (justificationImageUrl && !justificationImageUrl.startsWith("http")) {
                justificationImageUrl = `https://mediq-app.s3.us-east-2.amazonaws.com/justification/${justificationImageUrl}`;
              } else if (!justificationImageUrl && q.justificationImageName && q.justificationImageName.startsWith("http")) {
                justificationImageUrl = q.justificationImageName;
              }

              const isCorrect = answers[q.id] === q.rightAnswer;

              return (
                <li key={q.id} className={`exam-summary-item ${isCorrect ? "correct-answer" : "incorrect-answer"}`}>
                  <h4>{q.question}</h4>

                  {/* Justification Image */}
                  {justificationImageUrl && (
                    <div className="justification-image-container">
                      <img
                        src={justificationImageUrl}
                        alt="Justification"
                        className="exam-summary-justification-image"
                        onError={(e) => {
                          console.error("Justification Image failed to load:", e.target.src);
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Answer Details */}
                  <p><strong>Your Answer:</strong> {answers[q.id] || "Not Answered"}</p>
                  <p><strong>Correct Answer:</strong> {q.rightAnswer}</p>

                  {/* Justification Text */}
                  {q.justification && (
                    <p className="justification"><strong>Justification:</strong> {q.justification}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Buttons */}
        <div className="exam-summary-actions">
          <button className="retake-button" onClick={() => navigate("/exam", { state: { resetExam: true } })}>
            Retake Exam
          </button>
          <button className="exit-button" onClick={() => navigate("/")}>Exit</button>
        </div>
      </div>
    </div>
  );
};

export default ExamSummary;
