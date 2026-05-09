import { io } from "socket.io-client";

// Use VITE_API_URL but remove the /api/v1 part for the socket connection
const socketUrl = import.meta.env.VITE_API_URL.replace("/api/v1", "");

const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false, // We will connect manually after login
});

export default socket;
