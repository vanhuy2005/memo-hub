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
    <div className="fixed bottom-0 left-0 right-0 w-full z-50 px-4 pb-4">
      {/* 🌸 Floating Glassmorphism Nav */}
      <div className="relative mx-auto max-w-md">
        <div className="flex gap-2 rounded-pill bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl px-4 py-3 shadow-solid border-2 border-white dark:border-background-dark-hover">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl py-3 transition-all duration-300 ${
                  isActive
                    ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 scale-110"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:scale-105"
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
                <Icon
                  size={isActive ? 26 : 24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all"
                />
                <p
                  className={`text-[10px] ${
                    isActive ? "font-bold" : "font-semibold"
                  } leading-none tracking-tight`}
                >
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
