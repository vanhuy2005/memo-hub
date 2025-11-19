import express from "express";
import {
  getStudySession,
  reviewCard,
  getStudyStats,
} from "../controllers/studyController";
import { authenticate } from "../middlewares/auth.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import gamificationService from "../services/gamificationService";

const router = express.Router();

// Tất cả routes đều require authentication
router.use(authenticate);

router.get("/session", getStudySession);
router.post("/review/:cardId", reviewCard);
router.get("/stats", getStudyStats);

// Gamification endpoints
router.get(
  "/gamification",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const stats = await gamificationService.getGamificationStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Server error getting gamification stats",
        error: error.message,
      });
    }
  }
);

export default router;
