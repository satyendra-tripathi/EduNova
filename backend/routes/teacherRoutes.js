// backend/routes/teacherRoutes.js
import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getStudentDailyPerformance,
  getStudentWeeklyPerformance,
  getStudentSubjectStats,
  getTopStudents,
  getTopStudentsBySubject,

} from "../controllers/teacherController.js";

const router = express.Router();

// Protect all routes, only teacher role
router.use(isAuthenticated, authorizeRoles("teacher"));

// Student performance
router.get("/student/:studentId/daily", getStudentDailyPerformance);
router.get("/student/:studentId/weekly", getStudentWeeklyPerformance);
router.get("/student/:studentId/subjects", getStudentSubjectStats);

// Leaderboard
router.get("/top-students", getTopStudents);
router.get("/top-students/subject", getTopStudentsBySubject);



export default router;
