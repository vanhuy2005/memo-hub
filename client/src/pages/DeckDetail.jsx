import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { deckService, cardService } from "../services";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Plus,
  Upload,
  Edit,
  Trash2,
  Sparkles,
  Star,
  Clock,
  FileText,
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
    <div className="relative flex min-h-screen w-full flex-col font-display bg-surface-cream dark:bg-background-dark">
      {/* 🌸 Kawaii Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b-2 border-primary/20">
        <div className="flex items-center p-4 justify-between max-w-5xl mx-auto">
          <motion.button
            onClick={() => navigate("/decks")}
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.9 }}
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 dark:hover:bg-primary/20 transition-all shadow-solid-sm"
          >
            <ArrowLeft
              size={24}
              strokeWidth={2.5}
              className="text-text-dark dark:text-white"
            />
          </motion.button>
          <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 text-center text-text-dark dark:text-white px-4">
            {deck?.name}
          </h1>
          <div className="w-12"></div>
        </div>
      </header>

      {/* 🎨 Kawaii Deck Info Stats */}
      <div className="max-w-5xl mx-auto w-full p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl bg-gradient-to-br from-white via-primary/5 to-accent-blue/10 dark:from-gray-800 dark:to-gray-900 p-6 shadow-solid-lg border-2 border-white dark:border-gray-700"
        >
          <p className="text-text-secondary text-sm lg:text-base mb-5 font-semibold">
            {deck?.description || "Không có mô tả"}
          </p>

          {/* 🌈 Kawaii Stats Grid */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              {
                count: cards.length,
                label: "Tổng thẻ",
                icon: FileText,
                color: "bg-info/20 text-info",
                shadow: "shadow-solid-sm",
              },
              {
                count: cards.filter(
                  (c) =>
                    c.srs_status.interval >= 7 &&
                    c.srs_status.ease_factor >= 2.0
                ).length,
                label: "Đã thuộc",
                icon: Star,
                color: "bg-success/20 text-success",
                shadow: "shadow-solid-sm",
              },
              {
                count: cards.filter(
                  (c) =>
                    c.srs_status.interval > 0 &&
                    !(
                      c.srs_status.interval >= 7 &&
                      c.srs_status.ease_factor >= 2.0
                    )
                ).length,
                label: "Đang học",
                icon: Clock,
                color: "bg-warning/20 text-warning",
                shadow: "shadow-solid-sm",
              },
              {
                count: cards.filter((c) => c.srs_status.interval === 0).length,
                label: "Mới",
                icon: Sparkles,
                color: "bg-secondary/20 text-secondary",
                shadow: "shadow-solid-sm",
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className={`text-center p-4 rounded-3xl ${stat.color} ${stat.shadow}`}
                >
                  <Icon size={24} strokeWidth={2.5} className="mx-auto mb-2" />
                  <p className="text-3xl font-bold">{stat.count}</p>
                  <p className="text-xs font-bold mt-1 opacity-80">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* 🚀 Giant Study Button */}
          {cards.length > 0 && (
            <motion.button
              onClick={() => navigate("/study", { state: { deckId } })}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-4xl font-bold text-lg shadow-solid-primary-hover hover:shadow-solid-primary transition-all"
            >
              <GraduationCap size={28} strokeWidth={2.5} />
              <span>{t("dashboard.studyNow")}</span>
              <Sparkles size={20} className="animate-pulse" />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* 📚 Kawaii Cards List */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-3 pb-32">
        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen
                size={80}
                className="text-gray-300 dark:text-gray-600 mx-auto"
                strokeWidth={1.5}
              />
            </motion.div>
            <p className="text-text-secondary text-lg font-bold mt-6">
              {t("decks.noDecks")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/decks/${deckId}/cards/create`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary-hover text-white rounded-4xl font-bold transition-all shadow-solid-primary"
                >
                  <Plus size={22} strokeWidth={2.5} />
                  {t("cards.addCard")}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/decks/${deckId}/cards/import`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent/80 text-white rounded-4xl font-bold transition-all shadow-solid-accent"
                >
                  <Upload size={22} strokeWidth={2.5} />
                  {t("cards.importCards")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          cards.map((card, index) => {
            const getStatusStyle = () => {
              if (card.srs_status.interval === 0)
                return {
                  badge: "bg-secondary/20 text-secondary border-secondary",
                  label: "Mới",
                  icon: Sparkles,
                };
              if (
                card.srs_status.interval >= 7 &&
                card.srs_status.ease_factor >= 2.0
              )
                return {
                  badge: "bg-success/20 text-success border-success",
                  label: "Đã thuộc",
                  icon: Star,
                };
              return {
                badge: "bg-warning/20 text-warning border-warning",
                label: `${card.srs_status.interval}/7 ngày`,
                icon: Clock,
              };
            };

            const statusStyle = getStatusStyle();
            const StatusIcon = statusStyle.icon;

            return (
              <motion.div
                key={card._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-4xl p-5 shadow-solid hover:shadow-solid-lg transition-all border-2 border-white dark:border-gray-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-text-dark dark:text-white font-bold text-lg truncate">
                          {card.front_content}
                        </p>
                        <span
                          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-pill ${statusStyle.badge} border-2 font-bold whitespace-nowrap`}
                        >
                          <StatusIcon size={12} strokeWidth={2.5} />
                          {statusStyle.label}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm font-semibold mt-2 truncate">
                        {card.back_content}
                      </p>
                      {card.pronunciation && (
                        <p className="text-gray-400 text-xs mt-2 font-mono">
                          {card.pronunciation}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link
                          to={`/decks/${deckId}/cards/${card._id}/edit`}
                          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary transition-all shadow-solid-sm"
                        >
                          <Edit size={18} strokeWidth={2.5} />
                        </Link>
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: -15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setDeletingCard(card);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center justify-center w-10 h-10 rounded-2xl bg-error/10 hover:bg-error/20 text-error transition-all shadow-solid-sm"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </main>

      {/* 🌸 Kawaii FAB */}
      {cards.length > 0 && (
        <motion.div
          className="fixed bottom-28 right-6 z-40"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            to={`/decks/${deckId}/cards/create`}
            className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-solid-primary-hover border-2 border-white hover:shadow-solid-primary transition-all"
          >
            <Plus size={36} strokeWidth={3} />
          </Link>
        </motion.div>
      )}

      {/* 🗑️ Kawaii Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-4xl p-6 max-w-sm w-full shadow-solid-lg border-2 border-white dark:border-gray-700"
            >
              <div className="text-center mb-4">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-3"
                >
                  ⚠️
                </motion.div>
                <h3 className="text-xl font-bold text-text-dark dark:text-white mb-2">
                  {t("cards.deleteCard")}?
                </h3>
                <p className="text-text-secondary text-sm font-semibold">
                  {t("cards.confirmDeleteCard")}
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingCard(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-text-dark dark:text-white rounded-3xl font-bold hover:shadow-solid transition-all"
                >
                  {t("common.cancel")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteCard(deletingCard._id)}
                  className="flex-1 px-4 py-3 bg-error text-white rounded-3xl font-bold shadow-solid-secondary hover:shadow-solid-lg transition-all"
                >
                  {t("common.delete")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
