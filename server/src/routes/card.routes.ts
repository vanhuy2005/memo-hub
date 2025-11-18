import express from "express";
import {
  createCard,
  getCardsByDeck,
  getCardById,
  updateCard,
  deleteCard,
} from "../controllers/cardController";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Tất cả routes đều require authentication
router.use(authenticate);

router.post("/", createCard);
router.get("/byDeck/:deckId", getCardsByDeck);
router.get("/:cardId", getCardById);
router.put("/:cardId", updateCard);
router.delete("/:cardId", deleteCard);

export default router;
