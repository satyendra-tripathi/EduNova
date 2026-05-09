import express from "express";
import { generateQuiz, submitAnswer, generateAIQuiz } from "../controllers/quizController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiter for AI generation
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many quiz generation requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/generate", isAuthenticated, generateQuiz);
router.post("/ai-generate", isAuthenticated, authorizeRoles("teacher", "admin"), aiRateLimiter, generateAIQuiz);
// router.get("/subject/:subject", isAuthenticated, getQuizBySubject);
router.post("/answer/:quizId", isAuthenticated, submitAnswer);

export default router;
