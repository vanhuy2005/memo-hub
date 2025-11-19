import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function Flashcard({ card, onFlip, isFlipped }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Parallax tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const getCardStatus = () => {
    const interval = card.srs_status?.interval || 0;
    const easeFactor = card.srs_status?.ease_factor || 2.5;

    if (interval === 0) {
      return {
        label: "Thẻ mới",
        emoji: "🌱",
        color: "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800",
        badge: "bg-gray-500",
      };
    }
    if (interval >= 7 && easeFactor >= 2.0) {
      return {
        label: "Đã thuộc",
        emoji: "⭐",
        color: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
        badge: "bg-green-500",
      };
    }
    return {
      label: "Đang học",
      emoji: "📚",
      color: "from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30",
      badge: "bg-yellow-500",
    };
  };

  const status = getCardStatus();

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto perspective-1000"
      style={{
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
    >
      <motion.div
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        {/* Front Side */}
        <motion.div
          className={`absolute inset-0 w-full min-h-[400px] rounded-3xl border-4 border-white dark:border-gray-700 shadow-glow-lg bg-gradient-to-br ${status.color} backdrop-blur-xl`}
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.badge} text-white font-bold text-sm shadow-pop`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{status.emoji}</span>
                <span>{status.label}</span>
              </motion.div>
            </div>

            {/* Mastery Progress for Learning cards */}
            {card.srs_status?.interval < 7 && (
              <div className="absolute top-6 left-6">
                <div className="text-left">
                  <p className="text-xs text-text-secondary font-semibold mb-1">
                    Tiến độ thuộc
                  </p>
                  <div className="w-24 h-3 bg-white/50 dark:bg-gray-700/50 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-green-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          100,
                          ((card.srs_status?.interval || 0) / 7) * 100
                        )}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs font-bold text-text-primary mt-1">
                    {card.srs_status?.interval || 0}/7 ngày
                  </p>
                </div>
              </div>
            )}

            {/* Main Content */}
            <motion.div
              className="text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-7xl font-extrabold text-text-dark dark:text-white mb-4 break-words leading-tight">
                {card.front_content}
              </p>
              <motion.p
                className="text-lg text-text-secondary font-semibold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Bạn nhớ từ này không? 🤔
              </motion.p>
            </motion.div>

            {/* Click to Flip Hint */}
            {!isFlipped && (
              <motion.button
                onClick={onFlip}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 btn-primary px-8 py-4 text-lg flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>👀</span>
                <span>Xem đáp án</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Back Side */}
        <motion.div
          className={`w-full min-h-[400px] rounded-3xl border-4 border-white dark:border-gray-700 shadow-glow-lg bg-gradient-to-br from-primary-light/20 to-accent/20 backdrop-blur-xl`}
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            rotateY: 180,
          }}
        >
          <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
            {/* Answer */}
            <div className="text-center space-y-3">
              <p className="text-sm font-bold text-text-secondary uppercase tracking-wide">
                Dịch nghĩa
              </p>
              <p className="text-5xl font-extrabold text-primary-dark dark:text-primary break-words">
                {card.back_content}
              </p>
            </div>

            {/* Pronunciation */}
            {card.pronunciation && (
              <div className="text-center">
                <p className="text-sm font-bold text-text-secondary mb-1">
                  Phiên âm
                </p>
                <p className="text-2xl font-mono text-text-primary dark:text-white">
                  {card.pronunciation}
                </p>
              </div>
            )}

            {/* Example Sentence */}
            {card.example_sentence && (
              <div className="mt-6 pt-6 border-t-2 border-white/30 dark:border-gray-700/30 w-full">
                <p className="text-sm font-bold text-text-secondary mb-2 text-center">
                  Câu ví dụ
                </p>
                <p className="text-xl text-text-primary dark:text-gray-200 text-center italic break-words">
                  {card.example_sentence}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
