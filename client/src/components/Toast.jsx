import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  Sparkles,
} from "lucide-react";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      // Animate progress bar
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          clearInterval(progressInterval);
        }
      }, 16); // ~60fps

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [duration, onClose]);

  const types = {
    success: {
      borderColor: "#A7E9AF",
      icon: CheckCircle2,
      iconColor: "text-[#A7E9AF]",
      textColor: "text-[#4A5568] dark:text-white",
      progressColor: "bg-[#A7E9AF]",
      emoji: "✨",
      accentEmoji: "🌟",
    },
    error: {
      borderColor: "#FFB7B2",
      icon: XCircle,
      iconColor: "text-[#FFB7B2]",
      textColor: "text-[#4A5568] dark:text-white",
      progressColor: "bg-[#FFB7B2]",
      emoji: "💔",
      accentEmoji: "😢",
    },
    warning: {
      borderColor: "#FFD3B6",
      icon: AlertCircle,
      iconColor: "text-[#FFD3B6]",
      textColor: "text-[#4A5568] dark:text-white",
      progressColor: "bg-[#FFD3B6]",
      emoji: "⚠️",
      accentEmoji: "⚡",
    },
    info: {
      borderColor: "#B5DEFF",
      icon: Info,
      iconColor: "text-[#B5DEFF]",
      textColor: "text-[#4A5568] dark:text-white",
      progressColor: "bg-[#B5DEFF]",
      emoji: "💡",
      accentEmoji: "✨",
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="w-full max-w-md"
    >
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden"
        style={{
          borderLeft: `6px solid ${config.borderColor}`,
          boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.05)",
        }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {/* Floating accent emoji */}
        <motion.div
          className="absolute -top-1 -right-1 text-xl z-10"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {config.accentEmoji}
        </motion.div>

        <div className="relative p-4 pr-5">
          <div className="flex items-start gap-3">
            {/* Icon Section */}
            <motion.div
              className="flex-shrink-0 flex items-center gap-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
                delay: 0.1,
              }}
            >
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {config.emoji}
              </motion.span>
              <Icon size={24} className={config.iconColor} strokeWidth={2.5} />
            </motion.div>

            {/* Message */}
            <motion.div
              className="flex-1 pt-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <p
                className={`${config.textColor} font-bold text-sm leading-relaxed`}
              >
                {message}
              </p>
            </motion.div>

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className={`flex-shrink-0 ${config.iconColor} rounded-full p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700`}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <X size={18} strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* Progress Bar */}
          {duration > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-b-3xl overflow-hidden">
              <motion.div
                className={`h-full ${config.progressColor} rounded-b-3xl`}
                style={{
                  width: `${progress}%`,
                }}
                initial={{ width: "100%" }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Toast;
