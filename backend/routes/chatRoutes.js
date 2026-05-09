import express from "express";
import { sendMessage, getChatHistory, clearChatHistory } from "../controllers/chatController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendMessage);
router.get("/history", isAuthenticated, getChatHistory);
router.delete("/clear-chat", isAuthenticated, clearChatHistory);

export default router;
