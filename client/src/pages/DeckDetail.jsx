import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { deckService, cardService } from "../services";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Plus,
  Upload,
  Edit,
  Trash2,
} from "lucide-react";

export default function DeckDetail() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCard, setDeletingCard] = useState(null);

  const loadDeckDetails = useCallback(async () => {
    try {
      const [deckData, cardsData] = await Promise.all([
        deckService.getDeckById(deckId),
        cardService.getCardsByDeck(deckId),
      ]);
      setDeck(deckData.data.deck);
      setCards(cardsData.data.cards);
    } catch (err) {
      console.error("Error loading deck details:", err);
      error("😢 Không thể tải thông tin bộ từ");
      navigate("/decks");
    } finally {
      setLoading(false);
    }
  }, [deckId, navigate, error]);

  useEffect(() => {
    loadDeckDetails();
  }, [loadDeckDetails]);

  const handleDeleteCard = async (cardId) => {
    try {
      await cardService.deleteCard(cardId);
      setCards(cards.filter((card) => card._id !== cardId));
      setShowDeleteModal(false);
      setDeletingCard(null);
      success("✨ Đã xóa thẻ thành công!");
    } catch (err) {
      console.error("Error deleting card:", err);
      error(err.response?.data?.message || "😢 Không thể xóa thẻ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/decks")}
            className="text-gray-800 dark:text-gray-200 flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={28} strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-gray-900 dark:text-white px-4">
            {deck?.name}
          </h1>
          <div className="w-11"></div>
        </div>
      </header>

      {/* Deck Info - Enhanced with "Study Now" button */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="p-5 lg:p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base mb-5">
            {deck?.description || "Không có mô tả"}
          </p>
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            <div className="grid grid-cols-4 gap-4 lg:gap-6 flex-1">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {cards.length}
                </p>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Tổng thẻ
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
                  {
                    cards.filter(
                      (card) =>
                        card.srs_status.interval >= 7 &&
                        card.srs_status.ease_factor >= 2.0
                    ).length
                  }
                </p>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Đã thuộc ✓
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {
                    cards.filter(
                      (card) =>
                        card.srs_status.interval > 0 &&
                        !(
                          card.srs_status.interval >= 7 &&
                          card.srs_status.ease_factor >= 2.0
                        )
                    ).length
                  }
                </p>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Đang học ⏳
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-gray-500 dark:text-gray-400">
                  {
                    cards.filter((card) => card.srs_status.interval === 0)
                      .length
                  }
                </p>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Mới 📝
                </p>
              </div>
            </div>
            {cards.length > 0 && (
              <button
                onClick={() => navigate("/study", { state: { deckId } })}
                className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-base hover:shadow-xl hover:scale-105 transition-all shadow-lg"
              >
                <GraduationCap size={24} strokeWidth={2} />
                <span>{t("dashboard.studyNow")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards List - Responsive Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 lg:p-6 space-y-3 pb-24">
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen
              size={64}
              className="text-gray-400 mx-auto"
              strokeWidth={1.5}
            />
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {t("decks.noDecks")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Link
                to={`/decks/${deckId}/cards/create`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all"
              >
                <Plus size={20} strokeWidth={2} />
                {t("cards.addCard")}
              </Link>
              <Link
                to={`/decks/${deckId}/cards/import`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all"
              >
                <Upload size={20} strokeWidth={2} />
                {t("cards.importCards")}
              </Link>
            </div>
          </div>
        ) : (
          cards.map((card) => {
            const getStatusColor = () => {
              if (card.srs_status.interval === 0) return "border-l-gray-400";
              if (
                card.srs_status.interval >= 7 &&
                card.srs_status.ease_factor >= 2.0
              )
                return "border-l-green-500";
              return "border-l-yellow-500";
            };

            const getStatusLabel = () => {
              if (card.srs_status.interval === 0) return "Mới";
              if (
                card.srs_status.interval >= 7 &&
                card.srs_status.ease_factor >= 2.0
              )
                return "Đã thuộc";
              return `${card.srs_status.interval}/7 ngày`;
            };

            return (
              <div
                key={card._id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 ${getStatusColor()}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900 dark:text-white font-medium text-lg truncate">
                        {card.front_content}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {getStatusLabel()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 truncate">
                      {card.back_content}
                    </p>
                    {card.pronunciation && (
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-1 font-mono">
                        {card.pronunciation}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/decks/${deckId}/cards/${card._id}/edit`}
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      <Edit size={18} strokeWidth={2} />
                    </Link>
                    <button
                      onClick={() => {
                        setDeletingCard(card);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* FAB */}
      {cards.length > 0 && (
        <Link
          to={`/decks/${deckId}/cards/create`}
          className="fixed bottom-24 right-6 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all z-40"
        >
          <Plus size={32} strokeWidth={2} />
        </Link>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t("cards.deleteCard")}?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("cards.confirmDeleteCard")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingCard(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => handleDeleteCard(deletingCard._id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
