import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getCategories = () => {
  const token = sessionStorage.getItem("token"); // Ensure consistency
  return axios.get(`${API_BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCategories = () => {
  return axios.get(`${API_BASE_URL}/exam-categories`);
};


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

    export const addQuestion = async (questionData, token) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/add-question`, questionData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("🚨 Error adding question:", error);
        if (error.response) {
          console.error("🔹 Status Code:", error.response.status);
          console.error("🔹 Response Data:", error.response.data);
          console.error("🔹 Headers:", error.response.headers);
        } else if (error.request) {
          console.error("🔹 No response received:", error.request);
        } else {
          console.error("🔹 Request setup error:", error.message);
        }
        throw error;
      }
    };
    
    