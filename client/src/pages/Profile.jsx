import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
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

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden pb-20">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-gray-900 dark:text-gray-100 text-2xl font-bold leading-tight tracking-[-0.015em]">
          {t("profile.title")}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 space-y-4">
        {/* User Info Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold">
                {user?.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {user?.email}
              </p>
            </div>
          </div>
        </section>

        {/* Settings Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold px-6 pt-4 pb-2">
            {t("profile.settings")}
          </h3>

          {/* Learning Target */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Flag
                size={24}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
              <div className="text-left">
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {t("profile.learningTarget")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {user?.learning_target || t("profile.learningTarget")}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" strokeWidth={2} />
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Bell
                size={24}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
              <div className="text-left">
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {t("profile.notifications")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t("profile.dailyReminder")}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" strokeWidth={2} />
          </button>

          {/* Theme */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Palette
                size={24}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
              <div className="text-left">
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {t("profile.theme")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t("settings.system")}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" strokeWidth={2} />
          </button>

          {/* Language */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Globe
                size={24}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
              <div className="text-left">
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {t("profile.language")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t("settings.language")}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" strokeWidth={2} />
          </button>

          {/* Change Password */}
          <button
            onClick={() => navigate("/change-password")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <KeyRound
                size={24}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
              <div className="text-left">
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  Đổi mật khẩu
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Cập nhật mật khẩu của bạn
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" strokeWidth={2} />
          </button>
        </section>

        {/* About Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold px-6 pt-4 pb-2">
            {t("profile.about")}
          </h3>

          <button
            onClick={() => navigate("/about")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Info
                size={24}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {t("profile.about")}
              </p>
            </div>
            <ChevronRight size={20} className="text-gray-400" strokeWidth={2} />
          </button>

          <button
            onClick={() => navigate("/privacy")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <Shield
                size={24}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {t("profile.privacy")}
              </p>
            </div>
            <ChevronRight size={20} className="text-gray-400" strokeWidth={2} />
          </button>

          <button
            onClick={() => navigate("/terms")}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <FileText
                size={24}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {t("profile.terms")}
              </p>
            </div>
            <ChevronRight size={20} className="text-gray-400" strokeWidth={2} />
          </button>
        </section>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl py-4 font-bold transition-colors border border-red-200 dark:border-red-800"
        >
          <LogOut size={24} strokeWidth={2} />
          <span>{t("auth.logout")}</span>
        </button>

        {/* Version Info */}
        <p className="text-center text-gray-500 dark:text-gray-500 text-sm pb-4">
          MemoHub v1.0.0
        </p>
      </main>
    </div>
  );
}
