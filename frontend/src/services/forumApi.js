import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${API_URL}/forum`,
  withCredentials: true
});

export const postQuestion = (data) => API.post("/question", data);
export const postBatchQuestions = (data) => API.post("/questions/batch", data);
export const getAllQuestions = () => API.get("/getall");
export const postAnswer = (id, data) => API.post(`/answer/${id}`, data);
export const getMyQuestions = () => API.get("/my-questions");

export const updateQuestion = (id, data) => API.put(`/question/${id}`, data);
export const deleteQuestion = (id) => API.delete(`/question/${id}`);
export const markLongAnswer = (questionId, answerId, data) =>
  API.put(`/mark-long/${questionId}/${answerId}`, data);
export const evaluateLongAnswerAI = (questionId, answerId) =>
  API.put(`/ai-evaluate/${questionId}/${answerId}`);