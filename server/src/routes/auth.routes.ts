import express from "express";
import {
  register,
  login,
  getMe,
  updateSettings,
  changePassword,
} from "../controllers/authController";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);
router.put("/settings", authenticate, updateSettings);
router.put("/change-password", authenticate, changePassword);

export default router;
