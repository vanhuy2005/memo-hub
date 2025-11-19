import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { studyService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";
import { useTranslation } from "react-i18next";
import { School } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animation State Management with SessionStorage
  const [hasVisited, setHasVisited] = useState(() => {
    return sessionStorage.getItem("dashboard_visited") === "true";
  });

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  useEffect(() => {
    loadStats();

    // Mark dashboard as visited
    if (!hasVisited) {
      sessionStorage.setItem("dashboard_visited", "true");
      setHasVisited(true);
    }

    // Check if coming from completed study session
    if (location.state?.sessionComplete) {
      setShowCelebration(true);
      // Trigger massive confetti celebration
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
        colors: ["#88D8B0", "#FFB7B2", "#5BC0EB", "#FFD700", "#D8EFD3"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 80,
          origin: { x: 0 },
          colors: ["#88D8B0", "#FFB7B2"],
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 80,
          origin: { x: 1 },
          colors: ["#5BC0EB", "#FFD700"],
        });
      }, 200);
      setTimeout(() => setShowCelebration(false), 4000);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location, hasVisited]);

  const loadStats = async () => {
    try {
      const data = await studyService.getStudyStats();
      // Backend returns { success, message, stats }
      setStats(data);
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

  // Conditional animation variants based on visit history and user preferences
  const containerVariants = {
    hidden: { opacity: hasVisited || prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: hasVisited || prefersReducedMotion ? 0 : 0.1,
        delayChildren: hasVisited || prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: hasVisited || prefersReducedMotion ? 0 : 20,
      opacity: hasVisited || prefersReducedMotion ? 1 : 0,
      scale: hasVisited || prefersReducedMotion ? 1 : 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-surface-cream via-primary-light/10 to-accent/20 dark:bg-background-dark text-text-dark dark:text-white font-display overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Blobs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="blob bg-primary/20"
          style={{ top: "10%", left: "5%", width: "300px", height: "300px" }}
        />
        <div
          className="blob bg-secondary/20"
          style={{
            top: "50%",
            right: "10%",
            width: "400px",
            height: "400px",
            animationDelay: "2s",
          }}
        />
        <div
          className="blob bg-accent/20"
          style={{
            bottom: "10%",
            left: "30%",
            width: "350px",
            height: "350px",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="glass-card rounded-3xl p-8 shadow-glow-lg max-w-sm mx-4 text-center border-4 border-primary/50"
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
                }}
                transition={{ duration: 0.6 }}
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold gradient-text mb-2">
                {t("study.congratulations")}
              </h2>
              <p className="text-text-primary dark:text-gray-300 font-semibold">
                {t("study.completedSession")}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {["⭐", "🌟", "✨"].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-4xl"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.15,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
              <p className="mt-4 text-sm text-primary font-bold">
                Bạn thật tuyệt vời! 💖
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative flex-1 pb-24 max-w-5xl mx-auto w-full z-10">
        {/* Mascot Greeting Header */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between p-4 pb-2"
        >
          <div className="flex items-center gap-3">
            {/* Mascot Avatar */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3,
              }}
            >
              <motion.div
                className="text-6xl"
                animate={{
                  rotate: [-5, 5, -5],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🐱
              </motion.div>
              {/* Mood indicator based on streak */}
              <motion.div
                className="absolute -bottom-1 -right-1 text-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {stats?.stats?.current_streak >= 7
                  ? "⭐"
                  : stats?.stats?.current_streak >= 3
                  ? "😊"
                  : "🌱"}
              </motion.div>
            </motion.div>

            {/* Greeting Text */}
            <div className="flex flex-col">
              <motion.h2
                className="text-2xl font-bold leading-tight tracking-[-0.015em]"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span
                  className="inline-block"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2.5, delay: 0.6 }}
                >
                  👋
                </motion.span>{" "}
                {t("dashboard.welcome")}, {user?.username}!
              </motion.h2>
              <motion.p
                className="text-text-secondary text-sm font-medium pt-1 flex items-center gap-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.span
                  className="text-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔥
                </motion.span>
                {stats?.stats?.current_streak || 0} {t("dashboard.days")} streak
              </motion.p>
            </div>
          </div>

          {/* Profile Avatar */}
          <Link to="/profile" className="flex shrink-0">
            <motion.div
              className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold text-lg shadow-glow cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Start Guide - Show only if user has 0 cards */}
        {stats?.stats?.total_cards === 0 && (
          <motion.div
            variants={itemVariants}
            className="mx-4 mt-4 glass-card rounded-3xl p-6 shadow-glow border-2 border-primary/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚀
              </motion.span>
              <h3 className="text-xl font-bold text-text-dark dark:text-white">
                {t("dashboard.quickStart")}
              </h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  emoji: "🌍",
                  title: t("systemDecks.title"),
                  desc: t("systemDecks.subtitle"),
                },
                {
                  emoji: "✏️",
                  title: t("decks.createNew"),
                  desc: t("decks.createFirst"),
                },
                {
                  emoji: "🎯",
                  title: t("dashboard.studyNow"),
                  desc: t("dashboard.greeting"),
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="flex gap-3 items-start"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-soft">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-text-dark dark:text-white">
                      <span className="text-xl mr-1">{step.emoji}</span>
                      {step.title}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/system-decks">
              <motion.button
                className="mt-6 w-full btn-primary h-12 text-base"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("systemDecks.title")} →
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Learning Target Card */}
        {user?.learning_target && (
          <motion.div
            variants={itemVariants}
            className="mx-4 mt-4 glass-card rounded-3xl p-4 shadow-glow border-2 border-secondary/30"
            whileHover={{ scale: 1.02, rotate: 1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="bg-secondary/20 p-3 rounded-2xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-3xl">🚀</span>
                </motion.div>
                <div>
                  <p className="text-xs text-secondary font-semibold uppercase tracking-wide">
                    Mục tiêu học tập
                  </p>
                  <p className="text-lg font-bold text-text-dark dark:text-white">
                    {user.learning_target}
                  </p>
                </div>
              </div>
              <Link to="/settings">
                <motion.span
                  className="text-secondary hover:text-secondary-dark text-sm font-bold"
                  whileHover={{ x: 3 }}
                >
                  Thay đổi →
                </motion.span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Main Action Card */}
        <motion.div variants={itemVariants} className="p-4">
          <motion.div
            className="glass-card rounded-3xl bg-gradient-to-br from-primary to-primary-hover shadow-glow-lg border-2 border-white/50"
            whileHover={{ scale: 1.02, rotate: -1 }}
          >
            <div className="flex flex-col items-center justify-center gap-4 py-8 px-4">
              <motion.div
                className="text-6xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📚
              </motion.div>
              <p className="text-lg font-bold text-center text-white">
                {t("dashboard.studyNow")}:{" "}
                <motion.span
                  className="font-extrabold text-2xl"
                  key={stats?.due_today}
                  initial={{ scale: 1.5, color: "#FFD700" }}
                  animate={{ scale: 1, color: "#FFFFFF" }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {stats?.due_today || 0}
                </motion.span>{" "}
                {t("dashboard.cards")}.
              </p>
              <Link to="/study" className="w-full max-w-md">
                <motion.button
                  className="flex w-full items-center justify-center gap-2 rounded-full h-16 px-8 bg-white text-primary text-lg font-bold shadow-pop"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <School size={28} strokeWidth={2.5} />
                  <span>{t("dashboard.studyNow").toUpperCase()}</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bento Grid Stats Section */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 gap-4 p-4"
        >
          {/* Studied Today - Large Card */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-5 shadow-glow border-2 border-primary/30 col-span-2"
            whileHover={{ scale: 1.03, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                  <motion.span
                    className="text-3xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📖
                  </motion.span>
                  {t("dashboard.studiedToday")}
                </p>
                <motion.p
                  className="text-6xl font-extrabold mt-2 text-text-dark dark:text-white"
                  key={stats?.stats?.cards_studied_today}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {stats?.stats?.cards_studied_today || 0}
                </motion.p>
                <p className="text-sm text-text-secondary mt-2 font-semibold">
                  {(() => {
                    const studied = stats?.stats?.cards_studied_today || 0;
                    const goal = user?.daily_goal || 20;
                    const remaining = Math.max(0, goal - studied);
                    if (studied >= goal) {
                      return `🎉 Đã hoàn thành mục tiêu!`;
                    }
                    return `Còn ${remaining} thẻ nữa để đạt mục tiêu`;
                  })()}
                </p>
              </div>
              {/* Progress Ring */}
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{
                      strokeDashoffset:
                        251.2 -
                        251.2 *
                          Math.min(
                            (stats?.stats?.cards_studied_today || 0) /
                              (user?.daily_goal || 20),
                            1
                          ),
                    }}
                    className="text-primary"
                    strokeLinecap="round"
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {Math.round(
                      Math.min(
                        ((stats?.stats?.cards_studied_today || 0) /
                          (user?.daily_goal || 20)) *
                          100,
                        100
                      )
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cards Due */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-4 shadow-glow border-2 border-accent/30"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <motion.p
              className="text-5xl mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⏰
            </motion.p>
            <p className="text-xs font-bold text-text-secondary uppercase">
              {t("dashboard.cardsDue")}
            </p>
            <p className="text-4xl font-extrabold mt-1 text-text-dark dark:text-white">
              {stats?.stats?.cards_due_today || 0}
            </p>
          </motion.div>

          {/* Total Cards */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-4 shadow-glow border-2 border-secondary/30"
            whileHover={{ scale: 1.05, rotate: -2 }}
          >
            <motion.p
              className="text-5xl mb-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🧠
            </motion.p>
            <p className="text-xs font-bold text-text-secondary uppercase">
              {t("dashboard.totalCards")}
            </p>
            <p className="text-4xl font-extrabold mt-1 text-text-dark dark:text-white">
              {stats?.stats?.total_cards || 0}
            </p>
          </motion.div>

          {/* Mastered Cards - Large Card */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-5 shadow-glow border-2 border-yellow-300/50 col-span-2 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/20 dark:to-orange-900/20"
            whileHover={{ scale: 1.03, rotate: -1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide flex items-center gap-2">
                  <motion.span
                    className="text-3xl"
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🏆
                  </motion.span>
                  {t("dashboard.masteredCards")}
                </p>
                <motion.p
                  className="text-6xl font-extrabold mt-2 gradient-text"
                  key={stats?.stats?.mastered_cards}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {stats?.stats?.mastered_cards || 0}
                </motion.p>
                <p className="text-sm text-text-secondary mt-2 font-semibold">
                  {stats?.stats?.total_cards
                    ? Math.round(
                        ((stats?.stats?.mastered_cards || 0) /
                          stats.stats.total_cards) *
                          100
                      )
                    : 0}
                  % từ tổng số thẻ
                </p>
              </div>
              <motion.div
                className="text-7xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⭐
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </motion.div>
  );
}
