import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

export const generateAIQuiz = (data) => API.post("/quiz/ai-generate", data);

export const createAdminQuiz = (data) => API.post("/adminquiz/create-quiz", data);

export const getMyQuizzes = () => API.get("/adminquiz/student-quizzes"); // Reuse if needed

export default API;
