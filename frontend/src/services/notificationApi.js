import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/notifications`,
  withCredentials: true,
});

export const getMyNotifications = () => API.get("/my");
export const markAsRead = (id) => API.patch(`/${id}/read`);

export default API;
