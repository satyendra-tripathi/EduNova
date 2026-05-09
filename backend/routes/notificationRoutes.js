import express from "express";
import { getMyNotifications, markAsRead } from "../controllers/notificationController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", isAuthenticated, getMyNotifications);
router.patch("/:id/read", isAuthenticated, markAsRead);

export default router;
