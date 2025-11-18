import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { studyService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";
import { useTranslation } from "react-i18next";
import {
  Flame,
  Rocket,
  BookOpen,
  School,
  Clock,
  LayoutDashboard,
  Trophy,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadStats();

    // Check if coming from completed study session
    if (location.state?.sessionComplete) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadStats = async () => {
    try {
      const data = await studyService.getStudyStats();
      setStats(data.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
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
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display overflow-x-hidden">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center animate-bounce">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("study.congratulations")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t("study.completedSession")}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <span className="text-4xl">⭐</span>
              <span className="text-4xl">🌟</span>
              <span className="text-4xl">✨</span>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pb-24 max-w-5xl mx-auto w-full">
        {/* TopAppBar */}
        <div className="flex items-center bg-transparent p-4 pb-2 justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] flex-1">
              👋 {t("dashboard.welcome")}, {user?.username}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal pt-1 flex items-center gap-1">
              <Flame
                size={18}
                className="text-green-600 dark:text-green-400"
                fill="currentColor"
              />
              {stats?.stats?.current_streak || 0} {t("dashboard.days")}
            </p>
          </div>
          <Link
            to="/profile"
            className="flex size-12 shrink-0 items-center justify-end"
          >
            <div className="h-12 w-12 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>

        {/* Quick Start Guide - Show only if user has 0 cards */}
        {stats?.stats?.total_cards === 0 && (
          <div className="mx-4 mt-4 bg-green-50 dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-green-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <Rocket
                size={36}
                className="text-green-600 dark:text-green-400"
                strokeWidth={2}
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {t("dashboard.quickStart")}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    🌍 {t("systemDecks.title")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {t("systemDecks.subtitle")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    ✏️ {t("decks.createNew")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {t("decks.createFirst")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    🎯 {t("dashboard.studyNow")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {t("dashboard.greeting")}
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/system-decks"
              className="mt-6 w-full block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {t("systemDecks.title")} →
            </Link>
          </div>
        )}

        {/* Main Action Card */}
        <div className="p-4">
          <div className="flex flex-col items-stretch justify-start rounded-xl bg-green-600 dark:bg-green-700 shadow-lg">
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4 py-6 px-4">
              <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-center text-white">
                {t("dashboard.studyNow")}:{" "}
                <span className="font-extrabold">
                  {stats?.due_today || 0} {t("dashboard.cards")}
                </span>
                .
              </p>
              <div className="flex items-end justify-center">
                <Link
                  to="/study"
                  className="flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-6 bg-white text-green-600 text-base font-bold leading-normal shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <span className="truncate flex items-center gap-2">
                    <School size={24} />
                    {t("dashboard.studyNow").toUpperCase()}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-green-50 dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-green-200 dark:border-gray-600">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
              <BookOpen size={18} />
              {t("dashboard.studiedToday")}
            </p>
            <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">
              {stats?.stats?.cards_studied_today || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
              {t("dashboard.greeting")}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-green-200 dark:border-gray-600">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
              <Clock size={18} />
              {t("dashboard.cardsDue")}
            </p>
            <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">
              {stats?.stats?.cards_due_today || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
              {t("dashboard.noCardsToday")}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-green-200 dark:border-gray-600">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
              <LayoutDashboard size={18} />
              {t("dashboard.totalCards")}
            </p>
            <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">
              {stats?.stats?.total_cards || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
              {t("dashboard.cards")}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-green-200 dark:border-gray-600">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
              <Trophy size={18} />
              {t("dashboard.masteredCards")}
            </p>
            <p className="text-4xl font-bold mt-2 text-gray-800 dark:text-white">
              {stats?.stats?.mastered_cards || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
              {stats?.stats?.total_cards
                ? Math.round(
                    ((stats?.stats?.mastered_cards || 0) /
                      stats.stats.total_cards) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
