import express from "express";
import {
  getAllUsers,
  changeRole,
  deleteUser,
  createQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  addSubject,
  getSubjects,
  deleteSubject,
  getAllAnswers,
  toggleBlockUser
} from "../controllers/adminController.js";

import { isAuthenticated, isAdmin, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= USER MANAGEMENT =================
router.get("/users", isAuthenticated, isAdmin, getAllUsers);

router.patch(
  "/users/:id/role",
  isAuthenticated,
  isAdmin,
  changeRole
);

router.delete(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  deleteUser
);
router.put(
  "/user/block/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  toggleBlockUser
);

// ================= QUESTION MANAGEMENT =================
router.post(
  "/questions",
  isAuthenticated,
  isAdmin,
  createQuestion
);

router.get(
  "/questions",
  isAuthenticated,
  isAdmin,
  getAllQuestions
);

router.put(
  "/questions/:id",
  isAuthenticated,
  isAdmin,
  updateQuestion
);

router.delete(
  "/questions/:id",
  isAuthenticated,
  isAdmin,
  deleteQuestion
);

// ================= SUBJECT MANAGEMENT =================
router.post(
  "/subjects",
  isAuthenticated,
  isAdmin,
  addSubject
);

router.get(
  "/subjects",
  isAuthenticated,
  isAdmin,
  getSubjects
);

router.delete(
  "/subjects/:id",
  isAuthenticated,
  isAdmin,
  deleteSubject
);

// ================= ANSWER MONITORING =================
router.get(
  "/answers",
  isAuthenticated,
  isAdmin,
  getAllAnswers
);



export default router;