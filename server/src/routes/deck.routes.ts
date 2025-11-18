import express from "express";
import {
  createDeck,
  getMyDecks,
  getDeckById,
  deleteDeck,
  updateDeck,
  getPublicDecks,
} from "../controllers/deckController";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Tất cả routes đều require authentication
router.use(authenticate);

router.post("/", createDeck);
router.get("/my", getMyDecks);
router.get("/public", getPublicDecks);
router.get("/:deckId", getDeckById);
router.put("/:deckId", updateDeck);
router.delete("/:deckId", deleteDeck);

export default router;
