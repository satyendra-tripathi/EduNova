import express from "express";
import {isAuthenticated} from "../middleware/authMiddleware.js"
import { register, login, logout, changePassword, googleAuth, resendVerificationToken, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
// router.delete("/logout", isAuthenticated,logout);
router.delete("/logout",logout);
router.put("/student/change-password", isAuthenticated, changePassword);
router.post("/resend-verification", resendVerificationToken);
export default router;
