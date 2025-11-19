import { motion } from "framer-motion";

export default function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-cream via-primary-light/10 to-accent/20 dark:bg-background-dark">
      <div className="text-center">
        {/* Cute Loading Animation */}
        <motion.div
          className="relative inline-block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Mascot */}
          <motion.div
            className="text-8xl mb-4"
            animate={{
              rotate: [-10, 10, -10],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🐱
          </motion.div>

          {/* Loading Dots */}
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.p
          className="mt-6 text-text-secondary font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Đang tải...
        </motion.p>
      </div>
    </div>
  );
}
