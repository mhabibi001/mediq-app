import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddQuestionsForm.css"; // Ensure CSS is applied

const AddQuestionsForm = () => {
  const [question, setQuestion] = useState("");
  const [rightAnswer, setRightAnswer] = useState("");
  const [wrongAnswer1, setWrongAnswer1] = useState("");
  const [wrongAnswer2, setWrongAnswer2] = useState("");
  const [wrongAnswer3, setWrongAnswer3] = useState("");
  const [justification, setJustification] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [justificationImageFile, setJustificationImageFile] = useState(null);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/admin/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    // Validate Question Image
    if (imageFile) {
      if (!allowedTypes.includes(imageFile.type)) {
        alert("Only JPG, JPEG, and PNG images are allowed for question image.");
        return;
      }
      if (imageFile.size > 10 * 1024 * 1024) {
        alert("Question image size must not exceed 10MB.");
        return;
      }
    }

    // Validate Justification Image
    if (justificationImageFile) {
      if (!allowedTypes.includes(justificationImageFile.type)) {
        alert("Only JPG, JPEG, and PNG images are allowed for justification image.");
        return;
      }
      if (justificationImageFile.size > 10 * 1024 * 1024) {
        alert("Justification image size must not exceed 10MB.");
        return;
      }
    }

    // Ensure field names match what the backend expects
    const questionData = {
      question,
      rightAnswer,
      wrongAnswer1,
      wrongAnswer2,
      wrongAnswer3,
      justification,
      category: { id: category },
    };

    const formData = new FormData();
    formData.append("question", new Blob([JSON.stringify(questionData)], { type: "application/json" }));

    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (justificationImageFile) {
      formData.append("justificationImage", justificationImageFile);
    }

    try {
      await axios.post("http://localhost:8080/api/admin/add-question", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Question added successfully");

      // ✅ Reset form fields
      setQuestion("");
      setRightAnswer("");
      setWrongAnswer1("");
      setWrongAnswer2("");
      setWrongAnswer3("");
      setJustification("");
      setCategory("");
      setImageFile(null);
      setJustificationImageFile(null);
      document.getElementById("fileInput").value = ""; // Reset question image input
      document.getElementById("justificationFileInput").value = ""; // Reset justification image input
    } catch (error) {
      alert("Error adding question: " + (error.response?.data || error.message));
    }
  };

  return (
    <form className="add-question-form" onSubmit={handleSubmit}>
      <label>Question:</label>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />

      <label>Correct Answer:</label>
      <input type="text" value={rightAnswer} onChange={(e) => setRightAnswer(e.target.value)} required />

      <label>Wrong Answer 1:</label>
      <input type="text" value={wrongAnswer1} onChange={(e) => setWrongAnswer1(e.target.value)} required />

      <label>Wrong Answer 2:</label>
      <input type="text" value={wrongAnswer2} onChange={(e) => setWrongAnswer2(e.target.value)} required />

      <label>Wrong Answer 3:</label>
      <input type="text" value={wrongAnswer3} onChange={(e) => setWrongAnswer3(e.target.value)} required />

      <label>Justification:</label>
      <input type="text" value={justification} onChange={(e) => setJustification(e.target.value)} required />

      <label>Category:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <label>Upload Question Image:</label>
      <input id="fileInput" type="file" accept="image/jpeg, image/jpg, image/png" onChange={(e) => setImageFile(e.target.files[0])} />

      <label>Upload Justification Image:</label>
      <input id="justificationFileInput" type="file" accept="image/jpeg, image/jpg, image/png" onChange={(e) => setJustificationImageFile(e.target.files[0])} />

      <button type="submit">Add Question</button>
    </form>
  );
};

export default AddQuestionsForm;
