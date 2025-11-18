import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { systemDeckService } from "../services";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Package,
  LayoutDashboard,
  FolderOpen,
  Download,
} from "lucide-react";

export default function SystemDecks() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [copying, setCopying] = useState(null);

  const languages = [
    { value: "", label: "Tất cả ngôn ngữ" },
    { value: "en", label: "🇬🇧 Tiếng Anh" },
    { value: "ja", label: "🇯🇵 Tiếng Nhật" },
    { value: "ko", label: "🇰🇷 Tiếng Hàn" },
    { value: "zh", label: "🇨🇳 Tiếng Trung" },
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

  useEffect(() => {
    loadSystemDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, selectedLevel]);

  const loadSystemDecks = async () => {
    setLoading(true);
    try {
      const data = await systemDeckService.getSystemDecks(
        selectedLanguage,
        selectedLevel
      );
      setDecks(data.data.decks);
    } catch (error) {
      console.error("Error loading system decks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDeck = async (systemDeckId) => {
    setCopying(systemDeckId);
    try {
      const data = await systemDeckService.copySystemDeck(systemDeckId);
      alert(`Đã sao chép ${data.data.card_count} thẻ vào bộ từ của bạn!`);
      navigate(`/decks/${data.data.deck._id}`);
    } catch (error) {
      console.error("Error copying deck:", error);
      alert("Không thể sao chép bộ từ. Vui lòng thử lại.");
    } finally {
      setCopying(null);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center p-4 justify-between">
            <button
              onClick={() => navigate("/decks")}
              className="text-gray-800 dark:text-gray-200 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>
            <h1 className="text-lg lg:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-gray-900 dark:text-white pr-10">
              {t("systemDecks.title")}
            </h1>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto w-full p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              setSelectedLevel("");
            }}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {selectedLanguage && (
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Tất cả cấp độ</option>
              {levelsByLanguage[selectedLanguage]?.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Deck Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pb-24">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("common.loading")}
            </p>
          </div>
        ) : decks.length === 0 ? (
          <div className="text-center py-12">
            <Package
              size={64}
              className="text-gray-400 mx-auto"
              strokeWidth={1.5}
            />
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {t("decks.noDecks")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {decks.map((deck) => (
              <div
                key={deck._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Deck Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex-1">
                      {deck.name}
                    </h3>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                      {deck.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {deck.description}
                  </p>
                </div>

                {/* Deck Stats */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <LayoutDashboard
                        size={18}
                        className="text-green-600 dark:text-green-400"
                        strokeWidth={2}
                      />
                      <span>
                        {deck.card_count} {t("dashboard.cards")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FolderOpen
                        size={18}
                        className="text-green-600 dark:text-green-400"
                        strokeWidth={2}
                      />
                      <span>{deck.category}</span>
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <div className="p-4">
                  <button
                    onClick={() => handleCopyDeck(deck._id)}
                    disabled={copying === deck._id}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {copying === deck._id ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        {t("common.loading")}
                      </>
                    ) : (
                      <>
                        <Download size={18} strokeWidth={2} />
                        {t("systemDecks.download")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
