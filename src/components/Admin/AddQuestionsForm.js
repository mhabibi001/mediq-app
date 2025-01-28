import React, { useState, useEffect } from "react";
import { getCategories, addQuestion } from "../../utils/ApiService";


const AddQuestionForm = () => {
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
    getCategories().then((response) => setCategories(response.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const payload = {
      category: { id: formData.categoryId }, // Correctly send category ID as an object
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
      console.error("Error response:", error.response);
      alert(`Failed to add the question: ${error.response?.data?.message || error.message}`);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Category:</label>
      <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <label>Question:</label>
      <textarea name="question" value={formData.question} onChange={handleChange} required />
      <label>Right Answer:</label>
      <input type="text" name="rightAnswer" value={formData.rightAnswer} onChange={handleChange} required />
      <label>Wrong Answer 1:</label>
      <input type="text" name="wrongAnswer1" value={formData.wrongAnswer1} onChange={handleChange} required />
      <label>Wrong Answer 2:</label>
      <input type="text" name="wrongAnswer2" value={formData.wrongAnswer2} onChange={handleChange} required />
      <label>Wrong Answer 3:</label>
      <input type="text" name="wrongAnswer3" value={formData.wrongAnswer3} onChange={handleChange} required />
      <label>Justification:</label>
      <textarea name="justification" value={formData.justification} onChange={handleChange} required />
      <button type="submit">Add Question</button>
    </form>
  );
};

export default AddQuestionForm;