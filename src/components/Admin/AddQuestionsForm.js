import React, { useState, useEffect } from "react";
import { addQuestion, getCategories } from "../../utils/ApiService";
import "../../App.css";

const AddQuestionsForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    question: "",
    rightAnswer: "",
    wrongAnswer1: "",
    wrongAnswer2: "",
    wrongAnswer3: "",
    justification: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
        alert("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      category: { id: formData.categoryId },
      question: formData.question,
      rightAnswer: formData.rightAnswer,
      wrongAnswer1: formData.wrongAnswer1,
      wrongAnswer2: formData.wrongAnswer2,
      wrongAnswer3: formData.wrongAnswer3,
      justification: formData.justification,
    };

    addQuestion(payload)
      .then(() => {
        alert("Question added successfully!");
        setFormData({
          categoryId: "",
          question: "",
          rightAnswer: "",
          wrongAnswer1: "",
          wrongAnswer2: "",
          wrongAnswer3: "",
          justification: "",
        });
      })
      .catch((error) => {
        console.error("Error adding question:", error);
        alert("Failed to add the question. Please try again.");
      });
  };

  return (
    <div className="add-question-form">
      <h2>Add a New Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryId">Category:</label>
          <select
            name="categoryId"
            id="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <textarea
            name="question"
            id="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rightAnswer">Correct Answer:</label>
          <input
            type="text"
            name="rightAnswer"
            id="rightAnswer"
            value={formData.rightAnswer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wrongAnswer1">Wrong Answer 1:</label>
          <input
            type="text"
            name="wrongAnswer1"
            id="wrongAnswer1"
            value={formData.wrongAnswer1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wrongAnswer2">Wrong Answer 2:</label>
          <input
            type="text"
            name="wrongAnswer2"
            id="wrongAnswer2"
            value={formData.wrongAnswer2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="wrongAnswer3">Wrong Answer 3:</label>
          <input
            type="text"
            name="wrongAnswer3"
            id="wrongAnswer3"
            value={formData.wrongAnswer3}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="justification">Justification:</label>
          <textarea
            name="justification"
            id="justification"
            value={formData.justification}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestionsForm;
