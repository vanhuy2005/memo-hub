import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deckService } from "../services";
import BottomNav from "../components/BottomNav";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  Package,
  ChevronRight,
  Search,
  Plus,
  BookOpen,
  Globe,
  Sparkles,
} from "lucide-react";

export default function Decks() {
  const { t } = useTranslation();
  const [myDecks, setMyDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("my"); // 'my' or 'public'

  useEffect(() => {
    loadDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadDecks = async () => {
    setLoading(true);
    try {
      if (activeTab === "my") {
        const data = await deckService.getMyDecks();
        setMyDecks(data.data.decks);
      } else {
        const data = await deckService.getPublicDecks();
        setPublicDecks(data.data.decks);
      }
    } catch (error) {
      console.error("Error loading decks:", error);
    } finally {
      setLoading(false);
    }
  };

  const decks = activeTab === "my" ? myDecks : publicDecks;
  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-surface-cream dark:bg-background-dark overflow-x-hidden">
      {/* 🌸 Kawaii Header */}
      <header className="flex items-center bg-white/60 dark:bg-background-dark/60 backdrop-blur-xl p-4 pb-3 justify-between sticky top-0 z-10 border-b-2 border-primary/20">
        <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em] flex-1 text-text-dark dark:text-white flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-solid-primary"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <LayoutDashboard
              size={28}
              className="text-white"
              strokeWidth={2.5}
            />
          </motion.div>
          {t("nav.decks")}
        </h1>
        <Link
          to="/settings"
          className="flex items-center justify-center rounded-2xl h-12 w-12 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:shadow-solid"
        >
          <Settings
            size={22}
            className="text-gray-700 dark:text-gray-300"
            strokeWidth={2}
          />
        </Link>
      </header>

      {/* 🎨 Kawaii Tabs */}
      <div className="px-4 pt-4 space-y-4">
        <div className="flex gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-1.5 rounded-5xl shadow-solid-sm border-2 border-white dark:border-gray-700">
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-3 px-5 rounded-4xl font-bold transition-all duration-300 ${
              activeTab === "my"
                ? "bg-primary text-white shadow-solid-primary scale-105"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <BookOpen size={18} strokeWidth={2.5} />
              {t("decks.myDecks")}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={`flex-1 py-3 px-5 rounded-4xl font-bold transition-all duration-300 ${
              activeTab === "public"
                ? "bg-accent text-white shadow-solid-accent scale-105"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Globe size={18} strokeWidth={2.5} />
              {t("systemDecks.subtitle")}
            </span>
          </button>
        </div>

        {/* 🎁 System Decks Link - Kawaii Style */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/system-decks"
            className="flex items-center gap-4 px-5 py-5 bg-gradient-to-br from-secondary-light to-secondary rounded-4xl hover:shadow-solid-secondary transition-all border-3 border-white dark:border-gray-700 shadow-solid"
          >
            <motion.div
              className="flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-solid-sm"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Package size={32} className="text-secondary" strokeWidth={2.5} />
            </motion.div>
            <div className="flex-1">
              <p className="font-bold text-text-dark dark:text-white text-lg flex items-center gap-2">
                {t("systemDecks.title")}
                <Sparkles size={18} className="text-yellow-500 animate-pulse" />
              </p>
              <p className="text-sm text-text-secondary font-semibold mt-1">
                IELTS • JLPT • TOPIK • HSK
              </p>
            </div>
            <ChevronRight
              size={24}
              className="text-text-secondary"
              strokeWidth={2.5}
            />
          </Link>
        </motion.div>
      </div>

      {/* 🔍 Kawaii Search Bar */}
      <div className="px-4 py-3">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="flex items-center rounded-pill h-14 shadow-solid border-2 border-white dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden">
            <div className="flex items-center justify-center w-14 h-14 text-primary">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-full bg-transparent border-none focus:outline-none focus:ring-0 text-text-dark dark:text-white placeholder:text-gray-400 text-base font-semibold"
              placeholder={t("common.search")}
            />
          </div>
        </motion.div>
      </div>

      {/* Deck List */}
      <main className="flex-1 px-4 py-4 space-y-4 pb-24">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? t("decks.noDecks") : t("decks.createFirst")}
            </p>
          </div>
        ) : (
          filteredDecks.map((deck, index) => {
            const progress = deck.card_count > 0 ? 0 : 0; // TODO: Calculate actual progress

            // 🎨 Kawaii icon colors rotation
            const iconColors = [
              {
                bg: "bg-primary/20",
                icon: "text-primary",
                shadow: "shadow-solid-primary",
              },
              {
                bg: "bg-secondary/20",
                icon: "text-secondary",
                shadow: "shadow-solid-secondary",
              },
              {
                bg: "bg-accent/20",
                icon: "text-accent",
                shadow: "shadow-solid-accent",
              },
              { bg: "bg-info/20", icon: "text-info", shadow: "shadow-solid" },
            ];
            const colorScheme = iconColors[index % iconColors.length];

            return (
              <motion.div
                key={deck._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/decks/${deck._id}`}
                  className="flex items-center gap-4 rounded-4xl bg-white dark:bg-gray-800 p-5 hover:shadow-solid-lg transition-all border-2 border-white dark:border-gray-700 shadow-solid"
                >
                  {/* 🌸 Kawaii Icon Circle */}
                  <motion.div
                    className={`flex items-center justify-center w-16 h-16 rounded-3xl ${colorScheme.bg} ${colorScheme.shadow}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <BookOpen
                      size={28}
                      className={colorScheme.icon}
                      strokeWidth={2.5}
                    />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <p className="text-text-dark dark:text-white text-lg font-bold leading-tight tracking-tight truncate">
                      {deck.name}
                    </p>
                    <p className="text-text-secondary text-sm font-semibold mt-1">
                      {deck.card_count} thẻ
                    </p>

                    {/* 🌈 Kawaii Progress Bar - Gradient & Thicker */}
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="h-3 rounded-pill bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner">
                        <motion.div
                          className="h-full rounded-pill bg-gradient-to-r from-primary via-accent-blue to-secondary"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        )}
      </main>

      {/* 🌸 Kawaii FAB - Solid Shadow Style */}
      <motion.div
        className="fixed bottom-28 right-6 z-40"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link
          to="/decks/create"
          className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-solid-primary-hover border-2 border-white hover:shadow-solid-primary transition-all"
        >
          <Plus size={36} strokeWidth={3} />
        </Link>
      </motion.div>

      <BottomNav />
    </div>
  );
}
