import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Flag,
  Bell,
  Palette,
  Globe,
  Info,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  KeyRound,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
      className="relative flex h-auto min-h-screen w-full flex-col font-display bg-[#FEFBF6] dark:bg-[#2D2A32] overflow-x-hidden pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Elements Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {["💖", "⭐", "🌸", "✨", "🎀", "💫"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header
        variants={itemVariants}
        className="relative z-10 px-4 pt-6 pb-4"
      >
        <h1 className="text-gray-900 dark:text-gray-100 text-3xl font-black leading-tight bg-gradient-to-r from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] bg-clip-text text-transparent flex items-center gap-2">
          {t("profile.title")}
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            ✨
          </motion.span>
        </h1>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 space-y-4">
        {/* User Info Section */}
        <motion.section
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-pop border-4 border-white/50 dark:border-purple-700/30"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-pop"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-5xl font-black text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </motion.div>
            <div>
              <h2 className="text-gray-900 dark:text-gray-100 text-2xl font-black mb-1">
                {user?.username} 💖
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                {user?.email}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Settings Section */}
        <div className="space-y-3">
          <motion.h3
            variants={itemVariants}
            className="text-gray-900 dark:text-gray-100 text-xl font-black px-2"
          >
            {t("profile.settings")} ⚙️
          </motion.h3>

          {/* Learning Target Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/settings")}
            className="w-full bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft hover:shadow-pop border-4 border-white/50 dark:border-purple-700/30 transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFB7B2]/30 to-[#FFB7B2]/50 dark:from-[#FFB7B2]/20 dark:to-[#FFB7B2]/30 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Flag
                  size={24}
                  className="text-[#FFB7B2] dark:text-[#FFB7B2]"
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 dark:text-gray-100 font-black text-base">
                  {t("profile.learningTarget")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                  {user?.learning_target || "Đặt mục tiêu của bạn"}
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-400"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>

          {/* Notifications Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/settings")}
            className="w-full bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft hover:shadow-pop border-4 border-white/50 dark:border-purple-700/30 transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD3B6]/30 to-[#FFD3B6]/50 dark:from-[#FFD3B6]/20 dark:to-[#FFD3B6]/30 flex items-center justify-center"
                whileHover={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Bell
                  size={24}
                  className="text-[#FFD3B6] dark:text-[#FFD3B6]"
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 dark:text-gray-100 font-black text-base">
                  {t("profile.notifications")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                  {t("profile.dailyReminder")}
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-400"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>

          {/* Theme Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/settings")}
            className="w-full bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft hover:shadow-pop border-4 border-white/50 dark:border-purple-700/30 transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E0BBE4]/30 to-[#E0BBE4]/50 dark:from-[#E0BBE4]/20 dark:to-[#E0BBE4]/30 flex items-center justify-center"
                whileHover={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Palette
                  size={24}
                  className="text-[#E0BBE4] dark:text-[#E0BBE4]"
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 dark:text-gray-100 font-black text-base">
                  {t("profile.theme")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                  {t("settings.system")}
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-400"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>

          {/* Language Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/settings")}
            className="w-full bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft hover:shadow-pop border-4 border-white/50 dark:border-purple-700/30 transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B5DEFF]/30 to-[#B5DEFF]/50 dark:from-[#B5DEFF]/20 dark:to-[#B5DEFF]/30 flex items-center justify-center"
                whileHover={{ y: [0, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Globe
                  size={24}
                  className="text-[#B5DEFF] dark:text-[#B5DEFF]"
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 dark:text-gray-100 font-black text-base">
                  {t("profile.language")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                  {t("settings.language")}
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-400"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>

          {/* Change Password Card */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/change-password")}
            className="w-full bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft hover:shadow-pop border-4 border-white/50 dark:border-purple-700/30 transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4F0F0]/30 to-[#D4F0F0]/50 dark:from-[#D4F0F0]/20 dark:to-[#D4F0F0]/30 flex items-center justify-center"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
              >
                <KeyRound
                  size={24}
                  className="text-[#D4F0F0] dark:text-[#D4F0F0]"
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 dark:text-gray-100 font-black text-base">
                  Đổi mật khẩu
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
                  Cập nhật mật khẩu của bạn
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-400"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>
        </div>

        {/* About Section */}
        <div className="space-y-3">
          <motion.h3
            variants={itemVariants}
            className="text-gray-900 dark:text-gray-100 text-xl font-black px-2"
          >
            {t("profile.about")} 📖
          </motion.h3>

          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/about")}
            className="w-full bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft hover:shadow-pop border-4 border-white/50 dark:border-purple-700/30 transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A7E9AF]/30 to-[#A7E9AF]/50 dark:from-[#A7E9AF]/20 dark:to-[#A7E9AF]/30 flex items-center justify-center"
                whileHover={{ scale: [1, 1.2, 1] }}
              >
                <Info
                  size={24}
                  className="text-[#A7E9AF] dark:text-[#A7E9AF]"
                  strokeWidth={2.5}
                />
              </motion.div>
              <p className="text-gray-900 dark:text-gray-100 font-black text-base flex-1 text-left">
                {t("profile.about")}
              </p>
              <ChevronRight
                size={20}
                className="text-gray-400"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>

          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/privacy")}
            className="w-full bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft hover:shadow-pop border-4 border-white/50 dark:border-purple-700/30 transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#88D8B0]/30 to-[#88D8B0]/50 dark:from-[#88D8B0]/20 dark:to-[#88D8B0]/30 flex items-center justify-center"
                whileHover={{ rotate: [0, 20, -20, 0] }}
              >
                <Shield
                  size={24}
                  className="text-[#88D8B0] dark:text-[#88D8B0]"
                  strokeWidth={2.5}
                />
              </motion.div>
              <p className="text-gray-900 dark:text-gray-100 font-black text-base flex-1 text-left">
                {t("profile.privacy")}
              </p>
              <ChevronRight
                size={20}
                className="text-gray-400"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>

          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/terms")}
            className="w-full bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-soft hover:shadow-pop border-4 border-white/50 dark:border-purple-700/30 transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD3B6]/30 to-[#FFD3B6]/50 dark:from-[#FFD3B6]/20 dark:to-[#FFD3B6]/30 flex items-center justify-center"
                whileHover={{ y: [0, -5, 0] }}
              >
                <FileText
                  size={24}
                  className="text-[#FFD3B6] dark:text-[#FFD3B6]"
                  strokeWidth={2.5}
                />
              </motion.div>
              <p className="text-gray-900 dark:text-gray-100 font-black text-base flex-1 text-left">
                {t("profile.terms")}
              </p>
              <ChevronRight
                size={20}
                className="text-gray-400"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>
        </div>

        {/* Logout Button */}
        <motion.button
          variants={itemVariants}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 hover:from-red-200 hover:to-red-300 dark:hover:from-red-900/60 dark:hover:to-red-800/60 text-red-600 dark:text-red-400 rounded-[24px] py-5 font-black text-lg shadow-soft hover:shadow-pop border-4 border-red-300/50 dark:border-red-700/30 transition-all"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={24} strokeWidth={2.5} />
          <span>{t("auth.logout")} 👋</span>
        </motion.button>

        {/* Version Info */}
        <motion.p
          variants={itemVariants}
          className="text-center text-gray-500 dark:text-gray-500 text-sm pb-4 font-bold"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ MemoHub v1.0.0 ✨
          </motion.span>
        </motion.p>
      </main>
    </motion.div>
  );
}
