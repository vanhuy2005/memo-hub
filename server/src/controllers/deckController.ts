import { Response } from "express";
import Deck from "../models/Deck";
import Card from "../models/Card";
import { AuthRequest } from "../middlewares/auth.middleware";

// @desc    Tạo Bộ từ mới
// @route   POST /api/decks
// @access  Private
export const createDeck = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, is_public } = req.body;
    const userId = req.user?.id;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Deck name is required",
      });
      return;
    }

    const deck = await Deck.create({
      owner_id: userId,
      name,
      description: description || "",
      is_public: is_public || false,
    });

    res.status(201).json({
      success: true,
      message: "Deck created successfully",
      data: { deck },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error creating deck",
      error: error.message,
    });
  }
};

// @desc    Lấy tất cả Bộ từ của User
// @route   GET /api/decks/my
// @access  Private
export const getMyDecks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const decks = await Deck.find({ owner_id: userId }).sort({
      created_at: -1,
    });

    // Đếm số lượng thẻ trong mỗi deck
    const decksWithCardCount = await Promise.all(
      decks.map(async (deck) => {
        const cardCount = await Card.countDocuments({ deck_id: deck._id });
        return {
          ...deck.toObject(),
          card_count: cardCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: decks.length,
      data: { decks: decksWithCardCount },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching decks",
      error: error.message,
    });
  }
};

// @desc    Lấy chi tiết một Deck
// @route   GET /api/decks/:deckId
// @access  Private
export const getDeckById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { deckId } = req.params;
    const userId = req.user?.id;

    const deck = await Deck.findById(deckId);

    if (!deck) {
      res.status(404).json({
        success: false,
        message: "Deck not found",
      });
      return;
    }

    // Kiểm tra quyền truy cập (owner hoặc public deck)
    if (deck.owner_id.toString() !== userId && !deck.is_public) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    const cardCount = await Card.countDocuments({ deck_id: deck._id });

    res.status(200).json({
      success: true,
      data: {
        deck: {
          ...deck.toObject(),
          card_count: cardCount,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching deck",
      error: error.message,
    });
  }
};

// @desc    Xóa Bộ từ
// @route   DELETE /api/decks/:deckId
// @access  Private
export const deleteDeck = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { deckId } = req.params;
    const userId = req.user?.id;

    const deck = await Deck.findById(deckId);

    if (!deck) {
      res.status(404).json({
        success: false,
        message: "Deck not found",
      });
      return;
    }

    // Chỉ owner mới được xóa
    if (deck.owner_id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this deck",
      });
      return;
    }

    // Xóa tất cả thẻ trong deck trước
    await Card.deleteMany({ deck_id: deckId });

    // Xóa deck
    await Deck.findByIdAndDelete(deckId);

    res.status(200).json({
      success: true,
      message: "Deck and all associated cards deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error deleting deck",
      error: error.message,
    });
  }
};

// @desc    Cập nhật Bộ từ
// @route   PUT /api/decks/:deckId
// @access  Private
export const updateDeck = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { deckId } = req.params;
    const userId = req.user?.id;
    const { name, description, is_public } = req.body;

    const deck = await Deck.findById(deckId);

    if (!deck) {
      res.status(404).json({
        success: false,
        message: "Deck not found",
      });
      return;
    }

    // Chỉ owner mới được cập nhật
    if (deck.owner_id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this deck",
      });
      return;
    }

    // Update fields
    if (name) deck.name = name;
    if (description !== undefined) deck.description = description;
    if (is_public !== undefined) deck.is_public = is_public;

    await deck.save();

    res.status(200).json({
      success: true,
      message: "Deck updated successfully",
      data: { deck },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error updating deck",
      error: error.message,
    });
  }
};

// @desc    Lấy danh sách Bộ từ công khai
// @route   GET /api/decks/public
// @access  Private
export const getPublicDecks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Lấy bộ từ công khai không phải của user hiện tại
    const decks = await Deck.find({
      is_public: true,
      owner_id: { $ne: userId },
    })
      .populate("owner_id", "username")
      .sort({ created_at: -1 })
      .limit(50);

    // Đếm số lượng thẻ trong mỗi deck
    const decksWithCardCount = await Promise.all(
      decks.map(async (deck) => {
        const cardCount = await Card.countDocuments({ deck_id: deck._id });
        return {
          ...deck.toObject(),
          card_count: cardCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: decks.length,
      data: { decks: decksWithCardCount },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching public decks",
      error: error.message,
    });
  }
};
