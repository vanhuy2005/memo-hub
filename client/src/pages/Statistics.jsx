import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studyService } from "../services";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Flame,
  Trophy,
  TrendingUp,
  Target,
  Award,
  Sparkles,
} from "lucide-react";

export default function Statistics() {
  const [stats, setStats] = useState({
    total_cards: 0,
    learning_cards: 0,
    mastered_cards: 0,
    new_cards: 0,
    cards_due_today: 0,
    current_streak: 0,
    longest_streak: 0,
    weekly_activity: [],
    total_reviews: 0,
    avg_reviews_per_day: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("week");
  const navigate = useNavigate();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await studyService.getStudyStats();
      console.log("📊 Stats data received:", data);
      // Backend returns { success, message, stats }
      setStats(data.stats || data);
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFBF6] dark:bg-[#2D2A32]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="inline-block text-8xl mb-4"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
            Đang tải bảng thành tích...
          </p>
        </motion.div>
      </div>
    );
  }

  const masteryPercentage =
    stats.total_cards > 0
      ? Math.round((stats.mastered_cards / stats.total_cards) * 100)
      : 0;

  // Transform weekly_activity data from API
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();
  const weekData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayIndex = date.getDay();

    const activityItem = stats.weekly_activity?.find?.(
      (item) => item._id === dateStr
    );
    const count = activityItem ? activityItem.count : 0;

    weekData.push({
      day: dayNames[dayIndex],
      value: count,
      current: i === 0,
    });
  }

  // Normalize values to percentage (0-100) for display
  const maxCount = Math.max(...weekData.map((d) => d.value), 1);
  weekData.forEach((item) => {
    item.displayValue =
      maxCount > 0 ? Math.round((item.value / maxCount) * 100) : 0;
    if (item.displayValue === 0 && item.value > 0) item.displayValue = 10;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
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
      className="relative min-h-screen bg-[#FEFBF6] dark:bg-[#2D2A32] font-display pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Sparkles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Kawaii Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-10 bg-white/80 dark:bg-[#1F1D24]/80 backdrop-blur-xl border-b-4 border-white/50 dark:border-purple-700/30 shadow-soft"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center p-4 justify-between">
            <motion.button
              onClick={() => navigate("/dashboard")}
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-soft hover:shadow-pop transition-all"
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="text-primary" size={24} strokeWidth={3} />
            </motion.button>

            <motion.div
              className="flex-1 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[#4A5568] dark:text-white flex items-center justify-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  🏆
                </motion.span>
                Bảng Thành Tích
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </h1>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
                Bạn thật tuyệt vời! 💖
              </p>
            </motion.div>

            <div className="flex size-14 shrink-0"></div>
          </div>
        </div>
      </motion.header>

      <main className="relative flex-1 max-w-5xl mx-auto w-full px-4 lg:px-6 z-10">
        {/* Time Filter Pills */}
        <motion.div variants={itemVariants} className="flex py-6">
          <div className="flex w-full lg:max-w-md mx-auto items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 shadow-pop border-2 border-purple-200 dark:border-purple-700">
            {["week", "month", "year"].map((filter) => (
              <motion.label
                key={filter}
                className={`flex cursor-pointer h-12 grow items-center justify-center rounded-full px-6 font-bold text-base transition-all ${
                  timeFilter === filter
                    ? "bg-[#88D8B0] text-white shadow-glow scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="truncate">
                  {filter === "week"
                    ? "🌸 Tuần"
                    : filter === "month"
                    ? "🌈 Tháng"
                    : "🌟 Năm"}
                </span>
                <input
                  checked={timeFilter === filter}
                  onChange={() => setTimeFilter(filter)}
                  className="invisible w-0"
                  name="time-filter"
                  type="radio"
                  value={filter}
                />
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Streak Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {/* Current Streak */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[32px] bg-pink-200 dark:bg-pink-900/40 p-8 shadow-pop border-4 border-pink-300 dark:border-pink-700/30"
            whileHover={{ scale: 1.03, rotate: 1 }}
          >
            <div className="flex items-center justify-between">
              <div className="relative z-10">
                <p className="text-sm font-black text-pink-600 dark:text-pink-400 uppercase flex items-center gap-2 mb-2">
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Flame
                      className="text-orange-500"
                      size={28}
                      fill="currentColor"
                    />
                  </motion.span>
                  Chuỗi Ngày Học
                </p>
                <motion.p
                  className="text-7xl font-black text-orange-600 dark:text-orange-400 mb-2"
                  key={stats.current_streak}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {stats.current_streak}
                </motion.p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  ngày 🔥
                </p>
              </div>
              <motion.div
                className="text-9xl"
                animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥
              </motion.div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl"></div>
          </motion.div>

          {/* Longest Streak */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[32px] bg-yellow-200 dark:bg-yellow-900/40 p-8 shadow-pop border-4 border-yellow-300 dark:border-yellow-700/30"
            whileHover={{ scale: 1.03, rotate: -1 }}
          >
            <div className="flex items-center justify-between">
              <div className="relative z-10">
                <p className="text-sm font-black text-yellow-600 dark:text-yellow-400 uppercase flex items-center gap-2 mb-2">
                  <Trophy
                    className="text-yellow-500"
                    size={28}
                    fill="currentColor"
                  />
                  Kỷ Lục
                </p>
                <motion.p
                  className="text-7xl font-black text-yellow-600 dark:text-yellow-400 mb-2"
                  key={stats.longest_streak}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {stats.longest_streak}
                </motion.p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  ngày 🏆
                </p>
              </div>
              <motion.div
                className="text-9xl"
                animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⭐
              </motion.div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300/30 rounded-full blur-3xl"></div>
          </motion.div>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="rounded-[32px] border-4 border-white/50 p-8 lg:p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-pop">
            <div className="flex flex-col gap-2 mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp
                  className="text-[#88D8B0]"
                  size={32}
                  strokeWidth={3}
                />
                <p className="text-2xl lg:text-3xl font-black text-gray-800 dark:text-gray-200">
                  Hoạt động học tập
                </p>
              </div>
              <motion.p
                className="text-5xl lg:text-6xl font-black text-purple-600 dark:text-purple-400"
                key={stats.total_reviews}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {stats.total_reviews} lượt ôn
              </motion.p>
              <div className="flex items-center gap-2">
                <Sparkles
                  className="text-[#FFB7B2]"
                  size={20}
                  fill="currentColor"
                />
                <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  Trung bình {stats.avg_reviews_per_day} lượt/ngày
                </p>
              </div>
            </div>

            <div className="grid min-h-[200px] lg:min-h-[240px] grid-flow-col gap-4 lg:gap-6 grid-rows-[1fr_auto] items-end justify-items-center">
              {weekData.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-3 w-full h-full justify-end"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className={`w-full rounded-t-full transition-all shadow-soft relative group ${
                      item.current
                        ? "bg-[#88D8B0] shadow-glow"
                        : "bg-purple-300 dark:bg-purple-700"
                    }`}
                    style={{
                      height: `${item.displayValue || 5}%`,
                      minHeight: item.value > 0 ? "20px" : "5px",
                    }}
                  >
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-pop">
                      {item.value} lượt ôn 💖
                    </div>
                  </motion.div>
                  <p
                    className={`text-sm font-black ${
                      item.current
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.day}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mastery Progress */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex flex-col lg:flex-row items-center rounded-[32px] bg-purple-100 dark:bg-purple-900/50 border-4 border-white/50 p-8 lg:p-10 gap-8 shadow-pop">
            <div className="relative flex h-48 w-48 lg:h-56 lg:w-56 items-center justify-center shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="stroke-current text-gray-200 dark:text-gray-700"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="15.9155"
                  strokeWidth="4"
                ></circle>
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#88D8B0" />
                    <stop offset="50%" stopColor="#FFB7B2" />
                    <stop offset="100%" stopColor="#E0BBE4" />
                  </linearGradient>
                </defs>
                <motion.circle
                  className="stroke-current"
                  style={{ stroke: "url(#progressGradient)" }}
                  cx="18"
                  cy="18"
                  fill="none"
                  r="15.9155"
                  strokeLinecap="round"
                  strokeWidth="4"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${masteryPercentage}, 100` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <motion.span
                  className="text-5xl mb-2"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌟
                </motion.span>
                <span className="text-4xl font-black text-[#4A5568] dark:text-white">
                  {masteryPercentage}%
                </span>
                <span className="text-sm font-bold text-gray-600">
                  Đã thuộc
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center gap-3">
                <Target className="text-[#88D8B0]" size={32} />
                <p className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">
                  Hiệu suất học tập
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Tổng số thẻ",
                    value: stats.total_cards,
                    icon: "🎴",
                    color: "text-blue-600",
                  },
                  {
                    label: "Đã thuộc",
                    value: stats.mastered_cards,
                    icon: "✨",
                    color: "text-green-600",
                  },
                  {
                    label: "Đang học",
                    value: stats.learning_cards,
                    icon: "📖",
                    color: "text-yellow-600",
                  },
                  {
                    label: "Mới",
                    value: stats.new_cards,
                    icon: "🌱",
                    color: "text-gray-600",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-4 shadow-soft border-2 border-white/50"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <p className="text-sm font-bold text-gray-500 flex items-center gap-1">
                      <span className="text-xl">{stat.icon}</span>
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-black ${stat.color} mt-1`}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => navigate("/study")}
                className="flex items-center justify-center gap-2 rounded-full h-14 px-8 bg-[#88D8B0] hover:bg-[#6FCF97] text-white text-lg font-black shadow-pop"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Ôn tập ngay</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div variants={itemVariants} className="pb-6">
          <div className="rounded-[32px] bg-white/80 dark:bg-gray-800/80 border-4 border-white/50 p-8 shadow-pop">
            <div className="flex items-center gap-3 mb-6">
              <Award
                className="text-yellow-500"
                size={32}
                fill="currentColor"
              />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                Thành tích
              </h3>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { icon: "🎓", label: "Người học\nchăm chỉ", active: true },
                { icon: "🔥", label: "Streak\n10 ngày", active: true },
                { icon: "🧠", label: "Chuyên gia\ntừ vựng", active: true },
                { icon: "🚀", label: "Vượt\n1000 từ", active: false },
                { icon: "⏰", label: "Học\n30 phút", active: false },
                { icon: "🏆", label: "Top 10", active: false },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col items-center gap-3 ${
                    badge.active ? "" : "opacity-40"
                  }`}
                  whileHover={
                    badge.active ? { scale: 1.1, rotate: [0, -10, 10, 0] } : {}
                  }
                >
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-[28px] shadow-pop border-4 ${
                      i % 2 === 0
                        ? "bg-pink-200 dark:bg-pink-900/40 border-pink-300 dark:border-pink-700"
                        : "bg-purple-200 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700"
                    }`}
                  >
                    <span className="text-5xl">{badge.icon}</span>
                  </div>
                  <p className="text-xs font-bold text-center whitespace-pre-line">
                    {badge.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
