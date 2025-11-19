import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { studyService } from "../services";
import { useTranslation } from "react-i18next";
import { Activity, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Flashcard from "../components/Flashcard";

export default function StudySession() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [shaking, setShaking] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { error: showError, success: showSuccess } = useToast();
  const { state } = useLocation();
  const deckId = state?.deckId; // Lấy deckId từ navigation state

  // Helper to get card status
  const getCardStatus = (card) => {
    const interval = card.srs_status?.interval || 0;
    const easeFactor = card.srs_status?.ease_factor || 2.5;

    if (interval === 0) {
      return {
        label: "Thẻ mới",
        color: "bg-gray-500",
        textColor: "text-gray-500",
      };
    }
    if (interval >= 7 && easeFactor >= 2.0) {
      return {
        label: "Đã thuộc",
        color: "bg-green-500",
        textColor: "text-green-500",
      };
    }
    return {
      label: "Đang học",
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
    };
  };

  // Calculate progress to mastery
  const getMasteryProgress = (card) => {
    const interval = card.srs_status?.interval || 0;
    const easeFactor = card.srs_status?.ease_factor || 2.5;

    if (interval >= 7 && easeFactor >= 2.0) return 100;

    const intervalProgress = Math.min(100, (interval / 7) * 70);
    const easeProgress = easeFactor >= 2.0 ? 30 : 0;

    return Math.round(intervalProgress + easeProgress);
  };

  const loadStudySession = useCallback(async () => {
    try {
      const data = await studyService.getStudySession(50, deckId);
      if (data.data.cards.length === 0) {
        showError(
          deckId
            ? "🎉 Deck này không có thẻ nào cần ôn tập!"
            : "🎉 Không có thẻ nào cần ôn tập hôm nay!"
        );
        setTimeout(
          () => navigate(deckId ? `/decks/${deckId}` : "/dashboard"),
          1000
        );
        return;
      }
      setCards(data.data.cards);
    } catch (err) {
      console.error("Error loading study session:", err);
      showError("😢 Không thể tải phiên học. Vui lòng thử lại.");
      navigate(deckId ? `/decks/${deckId}` : "/dashboard");
    } finally {
      setLoading(false);
    }
  }, [navigate, deckId, showError]);

  useEffect(() => {
    loadStudySession();
  }, [loadStudySession]);

  const handleFlip = () => {
    setFlipped(true);
  };

  const handleReview = async (grade) => {
    if (reviewing) return;

    setReviewing(true);
    const currentCard = cards[currentIndex];
    const oldInterval = currentCard.srs_status?.interval || 0;

    // Optimistic UI: Immediately update UI
    const nextIndex = currentIndex + 1;
    const hasMoreCards = nextIndex < cards.length;

    // Trigger confetti for Good and Easy
    if (grade === 2) {
      // Good - Green confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
        colors: ["#88D8B0", "#95D2B3", "#7BC6A0"],
      });
    } else if (grade === 3) {
      // Easy - Blue and Gold confetti
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { x: 0.5, y: 0.6 },
        colors: ["#5BC0EB", "#FFD700", "#88D8B0"],
      });
    } else if (grade === 0) {
      // Again - Trigger shake
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }

    // Optimistic update
    if (hasMoreCards) {
      setCurrentIndex(nextIndex);
      setFlipped(false);
    }

    try {
      const response = await studyService.reviewCard(currentCard._id, grade);
      const newInterval = response.data.new_interval;
      const justMastered = oldInterval < 7 && newInterval >= 7;

      const gradeMessages = {
        0: {
          emoji: "😅",
          text: "Học lại từ đầu",
          detail:
            newInterval === 0
              ? "Ôn lại sau 10 phút"
              : `Ôn lại sau ${newInterval} ngày`,
        },
        1: {
          emoji: "🤔",
          text: "Hơi khó nhớ",
          detail: `Ôn lại sau ${newInterval} ngày (giảm tốc độ)`,
        },
        2: {
          emoji: "👍",
          text: "Tiến bộ tốt!",
          detail: `Ôn lại sau ${newInterval} ngày`,
        },
        3: {
          emoji: "🌟",
          text: "Xuất sắc!",
          detail: `Ôn lại sau ${newInterval} ngày (tăng tốc)`,
        },
      };

      const feedback = gradeMessages[grade];
      showSuccess(
        `${feedback.emoji} ${feedback.text}${
          justMastered ? " - 🎉 Bạn đã thuộc từ này!" : ""
        }`
      );

      if (!hasMoreCards) {
        // Session completed with celebration
        setTimeout(() => {
          navigate("/dashboard", { state: { sessionComplete: true } });
        }, 800);
      } else {
        setReviewing(false);
      }
    } catch (err) {
      console.error("Error reviewing card:", err);
      showError("😢 Có lỗi xảy ra. Vui lòng thử lại.");
      // Rollback optimistic update
      if (hasMoreCards) {
        setCurrentIndex(currentIndex);
        setFlipped(true);
      }
      setReviewing(false);
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

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <motion.div
      className="relative flex h-auto min-h-screen w-full flex-col font-display bg-gradient-to-br from-surface-cream via-primary-light/10 to-accent/20 dark:bg-background-dark overflow-x-hidden"
      animate={shaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Floating blobs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob bg-primary/20" style={{ top: "10%", left: "5%" }} />
        <div
          className="blob bg-secondary/20"
          style={{ top: "60%", right: "10%", animationDelay: "2s" }}
        />
        <div
          className="blob bg-accent/20"
          style={{ bottom: "20%", left: "50%", animationDelay: "4s" }}
        />
      </div>

      {/* Header Section */}
      <header className="sticky top-0 z-10 glass-card border-b-2 border-white/20 dark:border-gray-800">
        <div className="flex items-center p-4 pb-3 justify-between max-w-3xl mx-auto">
          <motion.button
            onClick={() => setShowExitDialog(true)}
            className="text-text-dark dark:text-gray-200 flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-white/50 dark:hover:bg-gray-800 transition-colors shadow-soft"
            whileHover={{ scale: 1.1, rotate: -90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={28} strokeWidth={2.5} />
          </motion.button>
          <motion.h1
            className="text-text-dark dark:text-gray-100 text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📖 {t("study.startStudy")}
          </motion.h1>
          <div className="size-11 shrink-0"></div>
        </div>

        {/* Cute Progress Road */}
        <div className="px-4 pb-4 max-w-3xl mx-auto w-full">
          <div className="flex flex-col gap-3">
            <div className="flex gap-6 justify-between items-center">
              <motion.p
                className="text-text-dark dark:text-gray-300 text-sm font-bold leading-normal flex items-center gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <Activity
                  size={18}
                  className="text-primary animate-pulse-soft"
                  strokeWidth={2.5}
                />
                {t("statistics.overview")}
              </motion.p>
              <motion.p
                className="text-text-dark dark:text-gray-300 text-sm font-bold leading-normal"
                key={currentIndex}
                initial={{ scale: 1.5, color: "#88D8B0" }}
                animate={{ scale: 1, color: "#4A5568" }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {currentIndex + 1}/{cards.length}
              </motion.p>
            </div>

            {/* The Road */}
            <div className="relative">
              <div className="relative rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:bg-gray-700 h-6 shadow-inner overflow-hidden border-2 border-white/50">
                {/* Road markings */}
                <div className="absolute inset-0 flex items-center justify-around px-4">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-2 bg-white/40 rounded-full"
                    />
                  ))}
                </div>

                {/* Progress fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-primary-light to-primary shadow-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </div>

              {/* Mascot walking */}
              <motion.div
                className="absolute -top-8 flex flex-col items-center"
                initial={{ left: "0%" }}
                animate={{ left: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{ transform: "translateX(-50%)" }}
              >
                <motion.div
                  className="text-4xl"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🐱
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Flashcard */}
      <main className="relative flex flex-1 flex-col p-4 pb-8 max-w-3xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="flex flex-col flex-1 justify-between gap-6"
          >
            {/* Flashcard Component */}
            <div className="flex-1 flex items-center justify-center py-8">
              <Flashcard
                card={currentCard}
                isFlipped={flipped}
                onFlip={handleFlip}
              />
            </div>

            {/* Review Buttons */}
            {flipped && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className="space-y-4"
              >
                {/* Help text */}
                <motion.p
                  className="text-center text-text-secondary font-semibold"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Bạn nhớ từ này thế nào? 💭
                </motion.p>

                {/* Huge Pill Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Again Button */}
                  <motion.button
                    onClick={() => handleReview(0)}
                    disabled={reviewing}
                    className="flex flex-col items-center justify-center rounded-full h-20 px-6 bg-secondary text-white font-bold text-lg shadow-pop disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="text-xl">😅 {t("study.again")}</span>
                    <span className="text-xs opacity-80 mt-1">10 phút</span>
                  </motion.button>

                  {/* Hard Button */}
                  <motion.button
                    onClick={() => handleReview(1)}
                    disabled={reviewing}
                    className="flex flex-col items-center justify-center rounded-full h-20 px-6 bg-orange-300 text-orange-900 font-bold text-lg shadow-pop disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="text-xl">🤔 {t("study.hard")}</span>
                    <span className="text-xs opacity-80 mt-1">-50%</span>
                  </motion.button>

                  {/* Good Button */}
                  <motion.button
                    onClick={() => handleReview(2)}
                    disabled={reviewing}
                    className="flex flex-col items-center justify-center rounded-full h-20 px-6 bg-primary text-white font-bold text-lg shadow-pop disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="text-xl">👍 {t("study.good")}</span>
                    <span className="text-xs opacity-80 mt-1">100%</span>
                  </motion.button>

                  {/* Easy Button */}
                  <motion.button
                    onClick={() => handleReview(3)}
                    disabled={reviewing}
                    className="flex flex-col items-center justify-center rounded-full h-20 px-6 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-lg shadow-pop disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span className="text-xl">🌟 {t("study.easy")}</span>
                    <span className="text-xs opacity-80 mt-1">+150%</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Exit Confirmation Dialog */}
      <AnimatePresence>
        {showExitDialog && (
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
              className="glass-card rounded-3xl p-8 max-w-sm w-full shadow-glow-lg border-4 border-white/50"
            >
              <div className="text-center mb-6">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  ⚠️
                </motion.div>
                <h3 className="text-2xl font-bold text-text-dark dark:text-white mb-3">
                  {t("study.backToDeck")}?
                </h3>
                <p className="text-text-secondary text-base">
                  Bạn đã học {currentIndex}/{cards.length} thẻ. Tiến độ chưa
                  lưu sẽ bị mất 😢
                </p>
              </div>
              <div className="flex gap-4">
                <motion.button
                  onClick={() => setShowExitDialog(false)}
                  className="flex-1 btn-primary h-14 text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💪 Tiếp tục học
                </motion.button>
                <motion.button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 px-4 h-14 bg-gray-200 dark:bg-gray-700 text-text-dark dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-soft text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Thoát
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
