// backend/routes/progressRoutes.js

import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  updateProgress,
  getDailyProgress,
  getWeeklyPerformance,
  getOverallProgress
} from "../controllers/progressController.js";

const router = express.Router();

// 1️⃣ Update student progress (called when student answers a question)
router.post("/update", isAuthenticated, updateProgress);

// 2️⃣ Get today's progress for logged-in student
router.get("/daily", isAuthenticated, getDailyProgress);

// 3️⃣ Get weekly performance for logged-in student
router.get("/weekly", isAuthenticated, getWeeklyPerformance);

// 4️⃣ Get overall progress for logged-in student
router.get("/overall", isAuthenticated, getOverallProgress);

export default router;
