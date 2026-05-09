import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1/forum",
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