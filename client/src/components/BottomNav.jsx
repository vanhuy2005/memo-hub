import { Link } from "react-router-dom";
import { Home, BookOpen, BarChart3, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BottomNav() {
  const { t } = useTranslation();

  const navItems = [
    { path: "/dashboard", icon: Home, label: t("nav.home") },
    { path: "/decks", icon: BookOpen, label: t("nav.decks") },
    { path: "/statistics", icon: BarChart3, label: t("nav.statistics") },
    { path: "/profile", icon: User, label: t("nav.profile") },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50">
      <div className="flex gap-1 border-t-2 border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-2 pb-4 pt-3 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = window.location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-all ${
                isActive
                  ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon
                size={28}
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-all"
              />
              <p
                className={`text-xs ${
                  isActive ? "font-bold" : "font-medium"
                } leading-normal tracking-[0.015em]`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
