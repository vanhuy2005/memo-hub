import { Response } from "express";
import Card from "../models/Card";
import Deck from "../models/Deck";
import { AuthRequest } from "../middlewares/auth.middleware";

// @desc    Thêm thẻ mới vào Deck
// @route   POST /api/cards
// @access  Private
export const createCard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      deck_id,
      front_content,
      back_content,
      pronunciation,
      example_sentence,
    } = req.body;
    const userId = req.user?.id;

    // Validate required fields
    if (!deck_id || !front_content || !back_content) {
      res.status(400).json({
        success: false,
        message: "deck_id, front_content, and back_content are required",
      });
      return;
    }

    // Kiểm tra deck có tồn tại và thuộc về user không
    const deck = await Deck.findById(deck_id);

    if (!deck) {
      res.status(404).json({
        success: false,
        message: "Deck not found",
      });
      return;
    }

    if (deck.owner_id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to add cards to this deck",
      });
      return;
    }

    // Tạo card mới
    const card = await Card.create({
      deck_id,
      user_id: userId,
      front_content,
      back_content,
      pronunciation: pronunciation || "",
      example_sentence: example_sentence || "",
      srs_status: {
        interval: 0,
        ease_factor: 2.5,
        next_review_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Card created successfully",
      data: { card },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error creating card",
      error: error.message,
    });
  }
};

// @desc    Lấy tất cả thẻ của một Deck
// @route   GET /api/cards/byDeck/:deckId
// @access  Private
export const getCardsByDeck = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { deckId } = req.params;
    const userId = req.user?.id;

    // Kiểm tra deck có tồn tại không
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

    // Lấy tất cả thẻ
    const cards = await Card.find({ deck_id: deckId }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: cards.length,
      data: { cards },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching cards",
      error: error.message,
    });
  }
};

// @desc    Lấy chi tiết một thẻ
// @route   GET /api/cards/:cardId
// @access  Private
export const getCardById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const userId = req.user?.id;

    const card = await Card.findById(cardId);

    if (!card) {
      res.status(404).json({
        success: false,
        message: "Card not found",
      });
      return;
    }

    // Chỉ owner mới được xem
    if (card.user_id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { card },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching card",
      error: error.message,
    });
  }
};

// @desc    Cập nhật nội dung thẻ
// @route   PUT /api/cards/:cardId
// @access  Private
export const updateCard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const userId = req.user?.id;
    const { front_content, back_content, pronunciation, example_sentence } =
      req.body;

    const card = await Card.findById(cardId);

    if (!card) {
      res.status(404).json({
        success: false,
        message: "Card not found",
      });
      return;
    }

    // Chỉ owner mới được cập nhật
    if (card.user_id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this card",
      });
      return;
    }

    // Update fields
    if (front_content) card.front_content = front_content;
    if (back_content) card.back_content = back_content;
    if (pronunciation !== undefined) card.pronunciation = pronunciation;
    if (example_sentence !== undefined)
      card.example_sentence = example_sentence;

    await card.save();

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: { card },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error updating card",
      error: error.message,
    });
  }
};

// @desc    Xóa thẻ
// @route   DELETE /api/cards/:cardId
// @access  Private
export const deleteCard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const userId = req.user?.id;

    const card = await Card.findById(cardId);

    if (!card) {
      res.status(404).json({
        success: false,
        message: "Card not found",
      });
      return;
    }

    // Chỉ owner mới được xóa
    if (card.user_id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this card",
      });
      return;
    }

    await Card.findByIdAndDelete(cardId);

    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error deleting card",
      error: error.message,
    });
  }
};
