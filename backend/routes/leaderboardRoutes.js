import express from "express";
import {
  getTopStudents,
  getStudentDailyPerformance,
  getSubjectWiseRanking,
  getStudentSubjectStats,
  getWeeklySubjectStats
} from "../controllers/leaderBoardController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Top N students
// router.get("/top",isAuthenticated, getTopStudents);
router.get("/top", getTopStudents);

// Day-wise performance of a student
// router.get("/student/:studentId/daily", isAuthenticated, getStudentDailyPerformance);
router.get("/student/:studentId/daily", getStudentDailyPerformance);

// Subject-wise ranking for all students
// router.get("/subject/ranking", isAuthenticated, getSubjectWiseRanking);
router.get("/subject/ranking", getSubjectWiseRanking);

// Weekly subject-wise stats & ranking
// router.get("/student/:studentId/weekly-subjects", isAuthenticated, getWeeklySubjectStats);
router.get("/student/:studentId/weekly-subjects", getWeeklySubjectStats);


// Single student's subject-wise stats & rank
// router.get("/student/:studentId/subjects", isAuthenticated, getStudentSubjectStats);
router.get("/student/:studentId/subjects",  getStudentSubjectStats);

export default router;
