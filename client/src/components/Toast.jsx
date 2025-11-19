import { useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  Sparkles,
} from "lucide-react";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
      border: "border-green-300 dark:border-green-700",
      icon: CheckCircle2,
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-800 dark:text-green-200",
      emoji: "✨",
    },
    error: {
      bg: "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30",
      border: "border-red-300 dark:border-red-700",
      icon: XCircle,
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-800 dark:text-red-200",
      emoji: "😢",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30",
      border: "border-yellow-300 dark:border-yellow-700",
      icon: AlertCircle,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      textColor: "text-yellow-800 dark:text-yellow-200",
      emoji: "⚠️",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30",
      border: "border-blue-300 dark:border-blue-700",
      icon: Info,
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-800 dark:text-blue-200",
      emoji: "💡",
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slideInRight">
      <div
        className={`${config.bg} ${config.border} border-2 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-sm`}
      >
        <div className="relative p-4">
          {/* Sparkles decoration for success */}
          {type === "success" && (
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles size={20} className="text-yellow-400 fill-yellow-400" />
            </div>
          )}

          <div className="flex items-start gap-3">
            {/* Icon and Emoji */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl">{config.emoji}</span>
              <Icon
                size={24}
                className={`${config.iconColor}`}
                strokeWidth={2.5}
              />
            </div>

            {/* Message */}
            <div className="flex-1 pt-1">
              <p
                className={`${config.textColor} font-semibold text-sm leading-relaxed`}
              >
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5`}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Progress bar */}
          {duration > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 rounded-b-2xl overflow-hidden">
              <div
                className={`h-full ${
                  type === "success"
                    ? "bg-green-500"
                    : type === "error"
                    ? "bg-red-500"
                    : type === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
                style={{
                  animation: `shrink ${duration}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;
