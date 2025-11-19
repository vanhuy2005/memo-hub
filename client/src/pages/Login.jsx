import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#FEFBF6] dark:bg-[#2D2A32] p-4 font-display overflow-hidden">
      {/* Floating Elements Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {["✨", "🌸", "💫", "🌟", "💖", "🎀"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Card Container */}
        <motion.div
          variants={itemVariants}
          className="rounded-[32px] bg-white dark:bg-gray-800 shadow-pop border-4 border-white/50 dark:border-purple-700/30 p-8 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <motion.div
              className="flex justify-center items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/fav-icon.png"
                alt="MemoHub Logo"
                className="w-12 h-12 object-contain"
              />
              <h2 className="text-3xl font-black bg-gradient-to-r from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] bg-clip-text text-transparent">
                MemoHub
              </h2>
            </motion.div>
            <h1 className="text-[#4A5568] dark:text-white text-3xl font-black leading-tight">
              Chào mừng trở lại! 💖
            </h1>
            <p className="text-[#718096] dark:text-gray-400 text-base font-semibold">
              Đăng nhập để tiếp tục hành trình của bạn
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border-4 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-[24px] mb-6 font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={24} strokeWidth={2.5} />
                </div>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-16 pl-16 pr-6 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-base placeholder:text-gray-400 focus:border-primary dark:focus:border-primary focus:outline-none transition-all"
                  placeholder="hello@example.com"
                  whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={24} strokeWidth={2.5} />
                </div>
                <motion.input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-16 pl-16 pr-16 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-base placeholder:text-gray-400 focus:border-primary dark:focus:border-primary focus:outline-none transition-all"
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff size={24} strokeWidth={2.5} />
                  ) : (
                    <Eye size={24} strokeWidth={2.5} />
                  )}
                </motion.button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline"
                >
                  Quên mật khẩu? 🔑
                </Link>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full h-16 rounded-full font-black text-xl transition-all flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] text-white shadow-glow"
              }`}
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              variants={itemVariants}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles size={24} />
                  </motion.div>
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400 text-base font-semibold">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-black text-purple-600 dark:text-purple-400 hover:underline"
              >
                Đăng ký ngay 🎀
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Decoration */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 text-gray-500 dark:text-gray-600 text-sm font-bold"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Made with 💖 by MemoHub Team ✨
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}
