import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
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
        // Change language dynamically
        i18n.changeLanguage(settings.language);
        alert(t("profile.changesSaved"));
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(t("common.loading"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center p-4 justify-between">
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-800 dark:text-gray-200 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>
            <h1 className="text-lg lg:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-gray-900 dark:text-white pr-10">
              {t("settings.title")}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 lg:p-6 pb-24 space-y-4">
        {/* Learning Goal */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-4">
              {t("settings.learningTarget")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  {t("profile.learningTarget")}
                </label>
                <input
                  type="text"
                  value={settings.learning_target}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      learning_target: e.target.value,
                    })
                  }
                  placeholder="IELTS 7.0, HSK 5, JLPT N2"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  {t("profile.dailyGoal")}:{" "}
                  <span className="text-primary font-bold">
                    {settings.daily_goal} {t("settings.cardsPerDay")}
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={settings.daily_goal}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      daily_goal: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-4">
              {t("settings.notifications")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {t("profile.dailyReminder")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t("profile.dailyReminder")}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications_enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications_enabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {settings.notifications_enabled && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    {t("profile.reminderTime")}
                  </label>
                  <input
                    type="time"
                    value={settings.reminder_time}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        reminder_time: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-4">
              {t("settings.theme")}
            </h3>
            <div className="space-y-2">
              {["auto", "light", "dark"].map((theme) => (
                <label
                  key={theme}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={settings.theme === theme}
                    onChange={(e) =>
                      setSettings({ ...settings, theme: e.target.value })
                    }
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-3 text-gray-900 dark:text-gray-100">
                    {theme === "auto"
                      ? t("settings.system")
                      : theme === "light"
                      ? t("settings.light")
                      : t("settings.dark")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-4">
              {t("settings.language")}
            </h3>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="vi">🇻🇳 Tiếng Việt</option>
              <option value="en">🇬🇧 English</option>
              <option value="zh">🇨🇳 中文 (Trung Quốc)</option>
              <option value="ja">🇯🇵 日本語 (Nhật Bản)</option>
              <option value="ko">🇰🇷 한국어 (Hàn Quốc)</option>
            </select>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-primary text-gray-900 rounded-full font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("common.loading") : t("profile.saveChanges")}
        </button>
      </main>
    </div>
  );
}
