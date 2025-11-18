import express from "express";
import {
  getStudySession,
  reviewCard,
  getStudyStats,
} from "../controllers/studyController";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Tất cả routes đều require authentication
router.use(authenticate);

router.get("/session", getStudySession);
router.post("/review/:cardId", reviewCard);
router.get("/stats", getStudyStats);

export default router;
