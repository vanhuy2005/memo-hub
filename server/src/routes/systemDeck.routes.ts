import express from "express";
import {
  getSystemDecks,
  getSystemDeckById,
  copySystemDeck,
} from "../controllers/systemDeckController";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Tất cả routes đều require authentication
router.use(authenticate);

router.get("/", getSystemDecks);
router.get("/:systemDeckId", getSystemDeckById);
router.post("/:systemDeckId/copy", copySystemDeck);

export default router;
