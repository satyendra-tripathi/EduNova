import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/authMiddleware.js";
import {upload} from "../utils/multer.js"
import { 
    postQuestion, 
    postAnswer, 
    getAllQuestions,
    addMultipleQuestions ,
    getMyQuestions,
    deleteQuestion,
    updateQuestion,
    markLongAnswer,
    getSingleQuestion,
    getTeacherSubjects,
    createSubject,
  
    uploadContent,
    getTeacherSubjectContent,
    deleteContent,
    downloadContent,
    deleteSubject,
    getStudentSubjectContent,
    evaluateLongAnswerAI
} from "../controllers/forumController.js";

console.log("📁 Forum Routes File Loaded");
const router = express.Router();

router.get("/test-route", (req, res) => res.json({ message: "Forum routes are working!" }));

router.put(
  "/ai-evaluate/:questionId/:answerId",
  isAuthenticated,
  authorizeRoles("teacher"),
  evaluateLongAnswerAI
);

router.put(
  "/ai-evaluate-long/:questionId/:answerId",
  isAuthenticated,
  authorizeRoles("teacher"),
  evaluateLongAnswerAI
);

// Single question
router.post("/question", isAuthenticated, authorizeRoles("teacher"), postQuestion);

// Batch questions
router.post("/questions/batch", isAuthenticated, authorizeRoles("teacher"), addMultipleQuestions);

// Student posts answer
router.post("/answer/:questionId", isAuthenticated, authorizeRoles("student"), postAnswer);

// Get all questions with answers
router.get("/getall", isAuthenticated, getAllQuestions);

router.get("/my-questions", isAuthenticated, authorizeRoles("teacher"), getMyQuestions);

router.put("/question/:id", isAuthenticated, authorizeRoles("teacher"), updateQuestion);

router.delete("/question/:id", isAuthenticated, authorizeRoles("teacher"), deleteQuestion);


router.put(
  "/mark-long/:questionId/:answerId",
  isAuthenticated,
  authorizeRoles("teacher"),
  markLongAnswer
);
// AI routes moved to top
router.get(
  "/question/:id",
  isAuthenticated,
  getSingleQuestion
);


router.get("/subjects", isAuthenticated, getTeacherSubjects);
router.post("/subject/create", isAuthenticated, createSubject);
router.delete("/subject/:id", isAuthenticated, deleteSubject);
router.post("/content/upload", isAuthenticated, upload.single("file"), uploadContent);
router.get(
  "/content/playlist",
  isAuthenticated,
  authorizeRoles("teacher"),
  getTeacherSubjectContent
);
router.delete(
  "/content/:id",
  isAuthenticated,
  deleteContent
);
router.get("/content/download/:id", isAuthenticated, downloadContent);
router.get(
  "/student/playlist",
  isAuthenticated,
  getStudentSubjectContent
);


export default router;
