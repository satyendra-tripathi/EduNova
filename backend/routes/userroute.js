// import express from "express";
// import multer from "multer";
// import { updateProfile, verifyEmail, adminUpdateUser } from "../controllers/userController.js";
// import { isAuthenticated, authorizeRoles } from "../middleware/authMiddleware.js";

// const router = express.Router();
// const upload = multer(); // memory storage for Cloudinary

// router.put("/profile", isAuthenticated, upload.single("avatar"), updateProfile);
// router.get("/verify-email/:token", verifyEmail);
// router.put("/admin/user/:id", isAuthenticated, authorizeRoles("admin"), adminUpdateUser);

// export default router;
// routes/userRoutes.js
import express from "express";
import multer from "multer";
import { updateProfile, adminUpdateUser } from "../controllers/userController.js";
import { verifyEmail } from "../controllers/authController.js";
import { isAuthenticated, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer(); // memory storage for Cloudinary

router.put("/profile", isAuthenticated, upload.single("avatar"), updateProfile);
router.get("/verify-email/:token", verifyEmail);
router.put("/admin/user/:id", isAuthenticated, authorizeRoles("admin"), adminUpdateUser);

export default router;
