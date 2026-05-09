import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student dashboard (only student can access)
router.get("/student", isAuthenticated, authorizeRoles("student"), (req, res) => {
  res.send(`Welcome Student: ${req.user.name}`);
});

// Teacher dashboard
router.get("/teacher", isAuthenticated, authorizeRoles("teacher"), (req, res) => {
  res.send(`Welcome Teacher: ${req.user.name}`);
});

// Admin dashboard
router.get("/admin", isAuthenticated, authorizeRoles("admin"), (req, res) => {
  res.send(`Welcome Admin: ${req.user.name}`);
});

export default router;
