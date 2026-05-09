import express from "express";
import {
  createQuiz,
  startQuiz,       
  getActiveQuiz,
  submitQuiz,      
  getMyResult,
  startStudentQuiz,
  submitQuestion,
  getStudentQuizzes,
  // getAdminAnalytics,
  // getGrowthAnalytics,
  // getTopStudents,
  // getSubjectAnalytics,
  // getAnswerDistribution
} from "../controllers/adminQuizController.js";

import { isAuthenticated, isAdmin, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
console.log("admin quiz routes loaded");
// ADMIN / TEACHER
router.post("/create-quiz", isAuthenticated, authorizeRoles("teacher", "admin"), createQuiz);
router.put("/start-quiz/:id", isAuthenticated, authorizeRoles("teacher", "admin"), startQuiz); 

// STUDENT
router.get("/active-quiz", isAuthenticated, getActiveQuiz);
router.post("/start-student-quiz", isAuthenticated, startStudentQuiz);
router.post("/submit-question", isAuthenticated, submitQuestion);
router.get("/student-quizzes", isAuthenticated, getStudentQuizzes);

// RESULT
router.get("/my-result/:quizId", isAuthenticated, getMyResult);


// router.get("/analytics", isAuthenticated, isAdmin, getAdminAnalytics);
// router.get("/growth", isAuthenticated, isAdmin, getGrowthAnalytics);
// router.get("/top-students", isAuthenticated, isAdmin, getTopStudents);
// router.get("/subjects", isAuthenticated, isAdmin, getSubjectAnalytics);
// router.get("/distribution", isAuthenticated, isAdmin, getAnswerDistribution);

export default router;