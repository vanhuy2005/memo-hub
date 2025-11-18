import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deckService } from "../services";
import BottomNav from "../components/BottomNav";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Settings,
  Package,
  ChevronRight,
  Search,
  Plus,
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
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Top App Bar */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-3 justify-between sticky top-0 z-10 backdrop-blur-md bg-opacity-95 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em] flex-1 text-gray-900 dark:text-white flex items-center gap-2">
          <LayoutDashboard
            size={32}
            className="text-green-600 dark:text-green-400"
            strokeWidth={2}
          />
          {t("nav.decks")}
        </h1>
        <Link
          to="/settings"
          className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings
            size={24}
            className="text-gray-700 dark:text-gray-300"
            strokeWidth={2}
          />
        </Link>
      </header>

      {/* Tabs */}
      <div className="px-4 pt-3 space-y-3">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "my"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {t("decks.myDecks")}
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "public"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {t("systemDecks.subtitle")}
          </button>
        </div>

        {/* System Decks Link */}
        <Link
          to="/system-decks"
          className="flex items-center gap-3 px-5 py-4 bg-green-50 dark:from-green-900/20 rounded-2xl hover:shadow-lg transition-all border-2 border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl">
            <Package size={28} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 dark:text-white text-base">
              {t("systemDecks.title")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              IELTS • JLPT • TOPIK • HSK
            </p>
          </div>
          <ChevronRight size={20} className="text-gray-500" strokeWidth={2} />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 flex border-none bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-full border-r-0">
              <Search size={20} strokeWidth={2} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-full text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-white dark:bg-gray-800 focus:border-none h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-base font-normal leading-normal"
              placeholder={t("common.search")}
            />
          </div>
        </label>
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
          filteredDecks.map((deck) => {
            const progress = deck.card_count > 0 ? 0 : 0; // TODO: Calculate actual progress
            return (
              <Link
                key={deck._id}
                to={`/decks/${deck._id}`}
                className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex w-full flex-col items-stretch justify-center gap-2">
                  <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    {deck.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal">
                    Đã học: 0/{deck.card_count}
                  </p>
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <Link
        to="/decks/create"
        className="fixed bottom-24 right-6 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all z-40"
      >
        <Plus size={32} strokeWidth={2} />
      </Link>

      <BottomNav />
    </div>
  );
}
