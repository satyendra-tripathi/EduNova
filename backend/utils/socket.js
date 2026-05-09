import { Server } from "socket.io";
import { Message } from "../models/Message.js";
import { sendToGeminiAI } from "./sendToGemini.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true, // Allow all origins or use process.env.FRONTEND_URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a private room for personal notifications
    socket.on("join_user_room", (userId) => {
      socket.join(userId);
      console.log(`📡 Socket: User ${userId} joined their private room ${userId}`);
    });

    // Existing AI Chat Logic
    socket.on("send_message", async ({ text, userId, role }) => {
      if (!text) return;

      const userMessage = await Message.create({ sender: userId, role, text });
      io.to(socket.id).emit("receive_message", userMessage);

      io.to(socket.id).emit("ai_typing", true);

      const aiResponseText = await sendToGeminiAI(text);

      const aiMessage = await Message.create({
        sender: process.env.AI_USER_ID,
        role: "ai",
        text: aiResponseText,
        user: userId,
      });

      io.to(socket.id).emit("ai_typing", false);
      io.to(socket.id).emit("receive_message", aiMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
