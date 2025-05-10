import express from "express";
import { registerUser, loginUser,getCurrentUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

export default router;
