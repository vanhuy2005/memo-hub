import { Response } from "express";
import SystemDeck from "../models/SystemDeck";
import SystemCard from "../models/SystemCard";
import Deck from "../models/Deck";
import Card from "../models/Card";
import { AuthRequest } from "../middlewares/auth.middleware";

// @desc    Lấy danh sách System Decks theo ngôn ngữ và level
// @route   GET /api/system-decks
// @access  Private
export const getSystemDecks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { language, level } = req.query;

    const filter: any = { is_active: true };
    if (language) filter.language = language;
    if (level) filter.level = level;

    const decks = await SystemDeck.find(filter).sort({ level: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: decks.length,
      data: { decks },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching system decks",
      error: error.message,
    });
  }
};

// @desc    Copy System Deck vào My Decks của user
// @route   POST /api/system-decks/:systemDeckId/copy
// @access  Private
export const copySystemDeck = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { systemDeckId } = req.params;
    const userId = req.user?.id;

    // Tìm system deck
    const systemDeck = await SystemDeck.findById(systemDeckId);

    if (!systemDeck) {
      res.status(404).json({
        success: false,
        message: "System deck not found",
      });
      return;
    }

    // Tạo deck mới cho user
    const newDeck = await Deck.create({
      owner_id: userId,
      name: systemDeck.name,
      description: systemDeck.description,
      is_public: false,
    });

    // Copy tất cả cards từ system deck
    const systemCards = await SystemCard.find({
      system_deck_id: systemDeckId,
    });

    const newCards = systemCards.map((card) => ({
      deck_id: newDeck._id,
      user_id: userId,
      front_content: card.front_content,
      back_content: card.back_content,
      pronunciation: card.pronunciation || "",
      example_sentence: card.example_sentence || "",
      srs_status: {
        interval: 0,
        ease_factor: 2.5,
        next_review_at: new Date(),
      },
    }));

    await Card.insertMany(newCards);

    res.status(201).json({
      success: true,
      message: `Copied ${systemCards.length} cards to your deck`,
      data: {
        deck: newDeck,
        card_count: systemCards.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error copying system deck",
      error: error.message,
    });
  }
};

// @desc    Xem chi tiết System Deck và cards
// @route   GET /api/system-decks/:systemDeckId
// @access  Private
export const getSystemDeckById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { systemDeckId } = req.params;

    const deck = await SystemDeck.findById(systemDeckId);

    if (!deck) {
      res.status(404).json({
        success: false,
        message: "System deck not found",
      });
      return;
    }

    const cards = await SystemCard.find({ system_deck_id: systemDeckId }).limit(
      10
    ); // Preview 10 cards

    res.status(200).json({
      success: true,
      data: {
        deck,
        preview_cards: cards,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching system deck",
      error: error.message,
    });
  }
};
