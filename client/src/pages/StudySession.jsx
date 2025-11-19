import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { studyService } from "../services";
import { useTranslation } from "react-i18next";
import { Activity, Eye, X } from "lucide-react";

export default function StudySession() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { error: showError } = useToast();
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
    try {
      const currentCard = cards[currentIndex];
      const response = await studyService.reviewCard(currentCard._id, grade);

      // Show feedback animation based on grade
      const oldInterval = currentCard.srs_status?.interval || 0;
      const newInterval = response.data.new_interval;

      const gradeMessages = {
        0: {
          emoji: "😅",
          text: "Học lại từ đầu",
          detail:
            newInterval === 0
              ? "Ôn lại sau 10 phút"
              : `Ôn lại sau ${newInterval} ngày`,
          color: "text-red-500",
        },
        1: {
          emoji: "🤔",
          text: "Hơi khó nhớ",
          detail: `Ôn lại sau ${newInterval} ngày (giảm tốc độ)`,
          color: "text-orange-500",
        },
        2: {
          emoji: "👍",
          text: "Tiến bộ tốt!",
          detail: `Ôn lại sau ${newInterval} ngày`,
          color: "text-green-500",
        },
        3: {
          emoji: "🌟",
          text: "Xuất sắc!",
          detail: `Ôn lại sau ${newInterval} ngày (tăng tốc)`,
          color: "text-blue-500",
        },
      };

      // Check if just mastered
      const justMastered = oldInterval < 7 && newInterval >= 7;
      const statusText = justMastered ? "🎉 Bạn đã thuộc từ này!" : "";

      const feedback = gradeMessages[grade];

      // Show temporary feedback
      const feedbackEl = document.createElement("div");
      feedbackEl.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center animate-bounce max-w-sm`;
      feedbackEl.innerHTML = `
        <div class="text-6xl mb-3">${feedback.emoji}</div>
        <div class="${feedback.color} text-xl font-bold mb-2">${
        feedback.text
      }</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">${
          feedback.detail
        }</div>
        ${
          statusText
            ? `<div class="text-base font-bold text-green-600 dark:text-green-400 mt-3">${statusText}</div>`
            : ""
        }
      `;
      document.body.appendChild(feedbackEl);

      setTimeout(() => {
        feedbackEl.remove();

        // Move to next card
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setFlipped(false);
          setReviewing(false); // Reset reviewing state
        } else {
          // Session completed with celebration
          navigate("/dashboard", { state: { sessionComplete: true } });
        }
      }, 1500);
    } catch (err) {
      console.error("Error reviewing card:", err);
      showError("😢 Có lỗi xảy ra. Vui lòng thử lại.");
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
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 pb-3 justify-between max-w-3xl mx-auto">
          <button
            onClick={() => setShowExitDialog(true)}
            className="text-gray-800 dark:text-gray-200 flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={28} strokeWidth={2.5} />
          </button>
          <h1 className="text-gray-900 dark:text-gray-100 text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            📖 {t("study.startStudy")}
          </h1>
          <div className="size-11 shrink-0"></div>
        </div>
        <div className="px-4 pb-3 max-w-3xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <div className="flex gap-6 justify-between">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal flex items-center gap-1">
                <Activity
                  size={18}
                  className="text-green-600 dark:text-green-400"
                  strokeWidth={2.5}
                />
                {t("statistics.overview")}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-bold leading-normal">
                {currentIndex + 1}/{cards.length}
              </p>
            </div>
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-3 shadow-inner">
              <div
                className="h-full rounded-full bg-green-600 transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Flashcard */}
      <main className="flex flex-1 flex-col p-4 max-w-3xl mx-auto w-full">
        {!flipped ? (
          // State 1: Front of the card
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full">
                <div className="flex flex-col items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm p-8 min-h-[300px] relative">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        getCardStatus(currentCard).color
                      }`}
                    >
                      {getCardStatus(currentCard).label}
                    </span>
                  </div>

                  {/* Mastery Progress */}
                  {currentCard.srs_status?.interval < 7 && (
                    <div className="absolute top-4 left-4 text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Tiến độ thuộc
                      </p>
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-green-500 transition-all duration-300"
                          style={{
                            width: `${getMasteryProgress(currentCard)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                        {currentCard.srs_status?.interval || 0}/7 ngày
                      </p>
                    </div>
                  )}

                  <p className="text-gray-900 dark:text-gray-100 text-6xl font-bold leading-tight tracking-[-0.015em] text-center break-words">
                    {currentCard.front_content}
                  </p>
                </div>
              </div>
            </div>
            <div className="py-4">
              <button
                onClick={handleFlip}
                className="flex min-w-[84px] max-w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl h-16 px-6 flex-1 bg-green-600 hover:bg-green-700 text-white text-lg font-bold leading-normal tracking-[0.015em] w-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Eye size={24} strokeWidth={2.5} />
                <span className="truncate">{t("study.showAnswer")}</span>
              </button>
            </div>
          </div>
        ) : (
          // State 2 & 3: Back of the card + Assessment Buttons
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full">
                <div className="flex flex-col items-stretch justify-center gap-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm p-6 min-h-[300px] text-center">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Dịch nghĩa
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 text-3xl font-bold mt-1 break-words">
                      {currentCard.back_content}
                    </p>
                  </div>
                  {currentCard.pronunciation && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        Phiên âm
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-xl font-mono mt-1">
                        {currentCard.pronunciation}
                      </p>
                    </div>
                  )}
                  {currentCard.example_sentence && (
                    <div className="border-t border-black/10 dark:border-white/10 pt-4">
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        Câu ví dụ
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 text-xl mt-2 break-words">
                        {currentCard.example_sentence}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assessment Buttons */}
            <div className="py-3 space-y-3">
              {/* Help text */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p className="font-medium mb-1">{t("study.showAnswer")}?</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleReview(0)}
                  disabled={reviewing}
                  className="flex flex-col min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 px-4 bg-[#DC3545]/20 text-[#DC3545] dark:bg-[#DC3545]/30 dark:text-red-300 font-bold hover:bg-[#DC3545]/30 dark:hover:bg-[#DC3545]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-base">{t("study.again")}</span>
                  <span className="text-xs opacity-70">
                    10 {t("dashboard.days")}
                  </span>
                </button>
                <button
                  onClick={() => handleReview(1)}
                  disabled={reviewing}
                  className="flex flex-col min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 px-4 bg-[#FD7E14]/20 text-[#FD7E14] dark:bg-[#FD7E14]/30 dark:text-orange-300 font-bold hover:bg-[#FD7E14]/30 dark:hover:bg-[#FD7E14]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-base">{t("study.hard")}</span>
                  <span className="text-xs opacity-70">-50%</span>
                </button>
                <button
                  onClick={() => handleReview(2)}
                  disabled={reviewing}
                  className="flex flex-col min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 px-4 bg-[#28A745]/20 text-[#28A745] dark:bg-[#28A745]/30 dark:text-green-300 font-bold hover:bg-[#28A745]/30 dark:hover:bg-[#28A745]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-base">{t("study.good")}</span>
                  <span className="text-xs opacity-70">100%</span>
                </button>
                <button
                  onClick={() => handleReview(3)}
                  disabled={reviewing}
                  className="flex flex-col min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 px-4 bg-[#007BFF]/20 text-[#007BFF] dark:bg-[#007BFF]/30 dark:text-blue-300 font-bold hover:bg-[#007BFF]/30 dark:hover:bg-[#007BFF]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-base">{t("study.easy")}</span>
                  <span className="text-xs opacity-70">+150%</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("study.backToDeck")}?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Bạn đã học {currentIndex}/{cards.length} thẻ. Tiến độ chưa lưu
                sẽ bị mất.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitDialog(false)}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
              >
                Tiếp tục học
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
