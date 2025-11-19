import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { authService } from "../services";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Target, Bell, Palette, Save, Sparkles } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
  const { success, error } = useToast();
  const [settings, setSettings] = useState({
    learning_target: "",
    daily_goal: 20,
    notifications_enabled: true,
    reminder_time: "09:00",
    theme: "auto",
    language: "vi",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings({
        learning_target: user.learning_target || "",
        daily_goal: user.daily_goal || 20,
        notifications_enabled:
          user.notifications_enabled !== undefined
            ? user.notifications_enabled
            : true,
        reminder_time: user.reminder_time || "09:00",
        theme: user.theme || "auto",
        language: user.language || "vi",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authService.updateSettings(settings);
      if (response.success) {
        updateUser(response.data.user);
        i18n.changeLanguage(settings.language);
        success("✨ " + t("profile.changesSaved"));
        setTimeout(() => navigate("/profile"), 500);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="min-h-screen bg-[#FEFBF6] dark:bg-[#2D2A32] font-display pb-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Candies Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {["🍭", "🍬", "🍡", "🧁", "🍰", "🍓"].map((candy, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {candy}
          </motion.div>
        ))}
      </div>

      {/* Kawaii Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-10 bg-white/80 dark:bg-[#1F1D24]/80 backdrop-blur-xl border-b-4 border-white/50 dark:border-purple-700/30 shadow-soft"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center p-4 justify-between">
            <motion.button
              onClick={() => navigate("/profile")}
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
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🍭
                </motion.span>
                Cài Đặt
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </h1>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
                Tùy chỉnh theo ý bạn! 💖
              </p>
            </motion.div>

            <div className="flex size-14 shrink-0"></div>
          </div>
        </div>
      </motion.header>

      <main className="relative max-w-4xl mx-auto px-4 lg:px-6 py-6 z-10">
        {/* Learning Target Card */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="rounded-[32px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-4 border-white/50 dark:border-purple-700/30 p-8 shadow-pop">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="text-[#FFB7B2]" size={32} strokeWidth={3} />
              </motion.div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Mục tiêu học tập
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <span>Mục tiêu của bạn là gì?</span>
                </label>
                <motion.input
                  type="text"
                  value={settings.learning_target}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      learning_target: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Đạt IELTS 7.0, Luyện thi JLPT N3..."
                  className="w-full px-6 py-4 rounded-[24px] border-4 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base focus:border-primary dark:focus:border-primary focus:outline-none focus:shadow-glow transition-all"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <span>Số thẻ học mỗi ngày: {settings.daily_goal} thẻ</span>
                </label>
                <div className="relative">
                  <motion.input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={settings.daily_goal}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        daily_goal: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-4 bg-gradient-to-r from-[#D4F0F0] to-[#E0BBE4] dark:from-[#88D8B0]/30 dark:to-[#E0BBE4]/30 rounded-full appearance-none cursor-pointer slider-thumb"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <div className="flex justify-between text-xs font-bold text-gray-500 mt-2">
                    <span>5 thẻ</span>
                    <span>100 thẻ</span>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <motion.div
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#88D8B0] to-[#FFB7B2] text-white font-black text-xl shadow-glow"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {settings.daily_goal} thẻ/ngày
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications Card */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="rounded-[32px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-4 border-white/50 dark:border-purple-700/30 p-8 shadow-pop">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bell className="text-yellow-500" size={32} strokeWidth={3} />
              </motion.div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Thông báo
              </h2>
            </div>

            <div className="space-y-6">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔔</span>
                  <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      Bật thông báo
                    </p>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Nhận nhắc nhở hàng ngày
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      notifications_enabled: !settings.notifications_enabled,
                    })
                  }
                  className={`relative w-20 h-10 rounded-full transition-all ${
                    settings.notifications_enabled
                      ? "bg-gradient-to-r from-[#A7E9AF] to-[#88D8B0] shadow-glow"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-8 h-8 bg-white rounded-full shadow-soft"
                    animate={{
                      left: settings.notifications_enabled
                        ? "calc(100% - 36px)"
                        : "4px",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              {/* Reminder Time */}
              {settings.notifications_enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <span className="text-xl">⏰</span>
                    <span>Thời gian nhắc nhở</span>
                  </label>
                  <motion.input
                    type="time"
                    value={settings.reminder_time}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reminder_time: e.target.value,
                      })
                    }
                    className="w-full px-6 py-4 rounded-[24px] border-4 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg focus:border-primary focus:outline-none focus:shadow-glow transition-all"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Theme & Language Card */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="rounded-[32px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-4 border-white/50 dark:border-purple-700/30 p-8 shadow-pop">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Palette className="text-[#E0BBE4]" size={32} strokeWidth={3} />
              </motion.div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Giao diện & Ngôn ngữ
              </h2>
            </div>

            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  <span>Chủ đề</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "light",
                      label: "Sáng",
                      emoji: "☀️",
                      color: "from-yellow-200 to-orange-200",
                    },
                    {
                      value: "dark",
                      label: "Tối",
                      emoji: "🌙",
                      color: "from-indigo-800 to-purple-800",
                    },
                    {
                      value: "auto",
                      label: "Tự động",
                      emoji: "✨",
                      color: "from-[#E0BBE4] to-[#FFB7B2]",
                    },
                  ].map((theme) => (
                    <motion.button
                      key={theme.value}
                      onClick={() =>
                        setSettings({ ...settings, theme: theme.value })
                      }
                      className={`flex flex-col items-center gap-2 p-4 rounded-[20px] border-4 transition-all ${
                        settings.theme === theme.value
                          ? "border-primary bg-gradient-to-br " +
                            theme.color +
                            " shadow-glow scale-105"
                          : "border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-4xl">{theme.emoji}</span>
                      <span
                        className={`text-sm font-black ${
                          settings.theme === theme.value
                            ? "text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {theme.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">🌏</span>
                  <span>Ngôn ngữ ứng dụng</span>
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
                    { value: "en", label: "English", flag: "🇬🇧" },
                    { value: "zh", label: "中文", flag: "🇨🇳" },
                    { value: "ja", label: "日本語", flag: "🇯🇵" },
                    { value: "ko", label: "한국어", flag: "🇰🇷" },
                  ].map((lang) => (
                    <motion.button
                      key={lang.value}
                      onClick={() =>
                        setSettings({ ...settings, language: lang.value })
                      }
                      className={`flex items-center justify-center gap-2 p-4 rounded-[20px] border-4 font-bold transition-all ${
                        settings.language === lang.value
                          ? "border-primary bg-gradient-to-r from-[#E0BBE4] to-[#FFB7B2] text-white shadow-glow scale-105"
                          : "border-slate-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-sm">{lang.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Floating Save Button */}
      <motion.div
        className="fixed bottom-20 left-0 right-0 z-20 px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={handleSave}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 rounded-full h-16 px-8 font-black text-xl shadow-pop transition-all ${
              loading
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] text-white hover:shadow-glow"
            }`}
            whileHover={!loading ? { scale: 1.02, y: -3 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={24} />
                </motion.div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={24} strokeWidth={3} />
                <span>Lưu thay đổi</span>
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #88D8B0, #FFB7B2);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(136, 216, 176, 0.4);
          border: 4px solid white;
        }

        .slider-thumb::-moz-range-thumb {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #88D8B0, #FFB7B2);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(136, 216, 176, 0.4);
          border: 4px solid white;
        }
      `,
        }}
      />
    </motion.div>
  );
}
