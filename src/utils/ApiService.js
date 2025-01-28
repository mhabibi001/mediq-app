import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getCategories = () => axios.get(`${API_BASE_URL}/admin/categories`);

export const getQuestionCount = (categoryId) =>
    axios.get(`${API_BASE_URL}/exam/questions/count`, { params: { categoryId } });
  

export const fetchQuestions = (categoryId, count) =>
  axios
    .get(`${API_BASE_URL}/exam/questions`, { params: { categoryId, count } })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching questions:", error);
      throw error;
    });

    export const addQuestion = (questionData) =>
      axios.post(`${API_BASE_URL}/admin/add-question`, questionData);