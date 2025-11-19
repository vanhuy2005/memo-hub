import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { systemDeckService } from "../services";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Sparkles, Cloud, Package } from "lucide-react";

export default function SystemDecks() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [copying, setCopying] = useState(null);

  const languages = [
    {
      value: "",
      label: "Tất cả",
      emoji: "🌈",
      color: "from-[#88D8B0] to-[#FFB7B2]",
    },
    {
      value: "en",
      label: "Tiếng Anh",
      emoji: "🇬🇧",
      color: "from-[#B5DEFF] to-[#88D8B0]",
    },
    {
      value: "ja",
      label: "Tiếng Nhật",
      emoji: "🇯🇵",
      color: "from-[#FFB7B2] to-[#FFD3B6]",
    },
    {
      value: "ko",
      label: "Tiếng Hàn",
      emoji: "🇰🇷",
      color: "from-[#E0BBE4] to-[#FFB7B2]",
    },
    {
      value: "zh",
      label: "Tiếng Trung",
      emoji: "🇨🇳",
      color: "from-[#FFB7B2] to-[#FFD3B6]",
    },
  ];

  const levelsByLanguage = {
    en: [
      "IELTS 4.0",
      "IELTS 5.0",
      "IELTS 6.0",
      "IELTS 6.5",
      "IELTS 7.0",
      "IELTS 7.5+",
    ],
    ja: ["N5", "N4", "N3", "N2", "N1"],
    ko: ["TOPIK I", "TOPIK II"],
    zh: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
  };

  const cardColors = [
    "from-[#FFB7B2]/30 to-[#FFD3B6]/30 dark:from-[#FFB7B2]/20 dark:to-[#FFD3B6]/20 border-[#FFB7B2]",
    "from-[#E0BBE4]/30 to-[#D4F0F0]/30 dark:from-[#E0BBE4]/20 dark:to-[#D4F0F0]/20 border-[#E0BBE4]",
    "from-[#B5DEFF]/30 to-[#88D8B0]/30 dark:from-[#B5DEFF]/20 dark:to-[#88D8B0]/20 border-[#B5DEFF]",
    "from-[#88D8B0]/30 to-[#A7E9AF]/30 dark:from-[#88D8B0]/20 dark:to-[#A7E9AF]/20 border-[#88D8B0]",
    "from-[#FFD3B6]/30 to-[#FFCBC7]/30 dark:from-[#FFD3B6]/20 dark:to-[#FFCBC7]/20 border-[#FFD3B6]",
    "from-[#D4F0F0]/30 to-[#E0BBE4]/30 dark:from-[#D4F0F0]/20 dark:to-[#E0BBE4]/20 border-[#D4F0F0]",
  ];

  useEffect(() => {
    loadSystemDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, selectedLevel]);

  const loadSystemDecks = async () => {
    try {
      setLoading(true);
      const response = await systemDeckService.getSystemDecks(
        selectedLanguage,
        selectedLevel
      );
      // Handle different response structures
      const deckData =
        response?.data?.decks || response?.data || response?.decks || [];
      setDecks(Array.isArray(deckData) ? deckData : []);
    } catch (err) {
      console.error("Error loading system decks:", err);
      error("Không thể tải bộ thẻ hệ thống");
      setDecks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDeck = async (deckId, deckName) => {
    try {
      setCopying(deckId);
      await systemDeckService.copySystemDeck(deckId);
      success(`✨ Đã tải xuống bộ thẻ "${deckName}"!`);
      setTimeout(() => {
        navigate("/decks");
      }, 1500);
    } catch (err) {
      console.error("Error copying deck:", err);
      error(err.response?.data?.message || "Không thể tải xuống bộ thẻ");
    } finally {
      setCopying(null);
    }
  };

  const availableLevels = selectedLanguage
    ? levelsByLanguage[selectedLanguage] || []
    : [];

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
            📚
          </motion.div>
          <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
            Đang tải thư viện mây hồng...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#FEFBF6] dark:bg-[#2D2A32] font-display pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Clouds Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            ☁️
          </motion.div>
        ))}
      </div>

      {/* Kawaii Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-10 bg-white/80 dark:bg-[#1F1D24]/80 backdrop-blur-xl border-b-4 border-white/50 dark:border-purple-700/30 shadow-soft"
      >
        <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] bg-clip-text text-transparent flex items-center justify-center gap-3">
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ☁️
                </motion.span>
                Thư Viện Mây Hồng
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  ✨
                </motion.span>
              </h1>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
                Kho bộ thẻ từ vựng siêu cute! 💖
              </p>
            </motion.div>

            <div className="flex size-14 shrink-0"></div>
          </div>
        </div>
      </motion.header>

      <main className="relative max-w-6xl mx-auto px-4 lg:px-6 py-6 z-10">
        {/* Language Pills - Horizontal Scroll */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Package className="text-[#E0BBE4]" size={24} strokeWidth={3} />
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Chọn ngôn ngữ
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {languages.map((lang) => (
              <motion.button
                key={lang.value}
                onClick={() => {
                  setSelectedLanguage(lang.value);
                  setSelectedLevel("");
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base whitespace-nowrap transition-all ${
                  selectedLanguage === lang.value
                    ? `bg-gradient-to-r ${lang.color} text-white shadow-glow scale-105`
                    : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 shadow-soft hover:shadow-pop"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">{lang.emoji}</span>
                <span>{lang.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Level Pills - Only show if language selected */}
        <AnimatePresence>
          {selectedLanguage && availableLevels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Cloud className="text-[#B5DEFF]" size={24} strokeWidth={3} />
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  Chọn cấp độ
                </h2>
              </div>
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  onClick={() => setSelectedLevel("")}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                    selectedLevel === ""
                      ? "bg-gradient-to-r from-[#88D8B0] to-[#FFB7B2] text-white shadow-glow scale-105"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 shadow-soft hover:shadow-pop"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tất cả cấp độ
                </motion.button>
                {availableLevels.map((level) => (
                  <motion.button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                      selectedLevel === level
                        ? "bg-gradient-to-r from-[#88D8B0] to-[#FFB7B2] text-white shadow-glow scale-105"
                        : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 shadow-soft hover:shadow-pop"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decks Grid - Candy Store Style */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {decks.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-16"
            >
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎀
              </motion.div>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                Không tìm thấy bộ thẻ nào
              </p>
              <p className="text-base text-gray-500 dark:text-gray-500">
                Hãy thử chọn bộ lọc khác nhé! 💕
              </p>
            </motion.div>
          ) : (
            decks.map((deck, index) => {
              const colorClass = cardColors[index % cardColors.length];
              const isCopying = copying === deck._id;

              return (
                <motion.div
                  key={deck._id}
                  variants={itemVariants}
                  className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br ${colorClass} p-6 shadow-pop border-4 border-white/50 dark:border-gray-700/30`}
                  whileHover={{ scale: 1.03, rotate: [0, 1, -1, 0] }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Language Badge */}
                  <motion.div
                    className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center border-4 border-white/70"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-4xl">
                      {languages.find((l) => l.value === deck.language)
                        ?.emoji || "🎴"}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10 pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span
                        className="text-xs font-black px-3 py-1 rounded-full bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 shadow-soft"
                        whileHover={{ scale: 1.05 }}
                      >
                        {deck.level}
                      </motion.span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                      {deck.name}
                    </h3>

                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-4 line-clamp-2">
                      {deck.description || "Bộ thẻ tuyệt vời cho bạn!"}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎴</span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                          {deck.cards_count || 0} thẻ
                        </span>
                      </div>
                      {deck.difficulty && (
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i <
                                (deck.difficulty === "easy"
                                  ? 2
                                  : deck.difficulty === "medium"
                                  ? 3
                                  : 4)
                                  ? "text-yellow-400"
                                  : "text-gray-300 dark:text-gray-700"
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Download Button */}
                    <motion.button
                      onClick={() => handleCopyDeck(deck._id, deck.name)}
                      disabled={isCopying}
                      className={`w-full flex items-center justify-center gap-2 rounded-full h-14 px-6 font-black text-base transition-all ${
                        isCopying
                          ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-soft hover:shadow-pop"
                      }`}
                      whileHover={!isCopying ? { scale: 1.05, y: -2 } : {}}
                      whileTap={!isCopying ? { scale: 0.95 } : {}}
                    >
                      {isCopying ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Sparkles size={20} />
                          </motion.div>
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <Download size={20} strokeWidth={3} />
                          <span>Tải xuống</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}
