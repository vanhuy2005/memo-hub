import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  Star,
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    learning_target: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register } = useAuth();
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!agreedToTerms) {
      setError("Vui lòng đồng ý với điều khoản dịch vụ");
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#FEFBF6] dark:bg-[#2D2A32] overflow-x-hidden p-4 font-display">
      {/* Floating Elements Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {["✨", "💖", "🌸", "⭐", "🎀", "💫", "🌟", "🦋"].map((emoji, i) => (
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
              opacity: [0.15, 0.4, 0.15],
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
          className="rounded-[40px] bg-white dark:bg-[#1F1D24] shadow-solid-lg border-4 border-white/80 dark:border-purple-700/30 p-8 backdrop-blur-sm"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-3 mb-8"
          >
            <motion.div
              className="flex justify-center items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/fav-icon.png"
                alt="MemoHub Logo"
                className="w-14 h-14 object-contain"
              />
              <h2 className="text-3xl font-black bg-gradient-to-r from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] bg-clip-text text-transparent">
                MemoHub
              </h2>
            </motion.div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4F0F0] to-[#E0BBE4] rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles
                className="text-[#4A5568]"
                size={20}
                strokeWidth={2.5}
              />
              <span className="text-[#4A5568] text-sm font-black">
                Cổng chào mộng mơ
              </span>
              <Heart className="text-[#FFB7B2]" size={20} strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-[#4A5568] dark:text-white text-3xl font-black leading-tight">
              Tạo tài khoản mới 🎀
            </h1>
            <p className="text-[#718096] dark:text-gray-400 text-base font-semibold">
              Chào mừng bạn! Hãy bắt đầu hành trình học ngôn ngữ thật tuyệt vời
              ✨
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#FFCBC7] dark:bg-red-900/30 border-4 border-[#FF9E98] dark:border-red-800 text-[#4A5568] dark:text-red-300 px-6 py-4 rounded-[24px] font-bold text-center shadow-solid"
            >
              ❌ {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* Username Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-[#4A5568] dark:text-gray-300 mb-2">
                <User className="inline mr-2" size={18} strokeWidth={2.5} />
                Tên người dùng
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#718096]">
                  <User size={22} strokeWidth={2.5} />
                </div>
                <motion.input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full h-16 pl-16 pr-6 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1D24] text-[#4A5568] dark:text-white font-bold text-base placeholder:text-[#718096] focus:border-[#88D8B0] dark:focus:border-[#88D8B0] focus:outline-none transition-all shadow-solid-sm"
                  placeholder="Nhập tên người dùng của bạn"
                  whileFocus={{ scale: 1.02, borderColor: "#88D8B0" }}
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-[#4A5568] dark:text-gray-300 mb-2">
                <Mail className="inline mr-2" size={18} strokeWidth={2.5} />
                Email
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#718096]">
                  <Mail size={22} strokeWidth={2.5} />
                </div>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-16 pl-16 pr-6 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1D24] text-[#4A5568] dark:text-white font-bold text-base placeholder:text-[#718096] focus:border-[#88D8B0] dark:focus:border-[#88D8B0] focus:outline-none transition-all shadow-solid-sm"
                  placeholder="hello@example.com"
                  whileFocus={{ scale: 1.02, borderColor: "#88D8B0" }}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-[#4A5568] dark:text-gray-300 mb-2">
                <Lock className="inline mr-2" size={18} strokeWidth={2.5} />
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#718096]">
                  <Lock size={22} strokeWidth={2.5} />
                </div>
                <motion.input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full h-16 pl-16 pr-16 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1D24] text-[#4A5568] dark:text-white font-bold text-base placeholder:text-[#718096] focus:border-[#88D8B0] dark:focus:border-[#88D8B0] focus:outline-none transition-all shadow-solid-sm"
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.02, borderColor: "#88D8B0" }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#88D8B0]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff size={22} strokeWidth={2.5} />
                  ) : (
                    <Eye size={22} strokeWidth={2.5} />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-[#4A5568] dark:text-gray-300 mb-2">
                <Lock className="inline mr-2" size={18} strokeWidth={2.5} />
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#718096]">
                  <Lock size={22} strokeWidth={2.5} />
                </div>
                <motion.input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full h-16 pl-16 pr-16 rounded-full border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F1D24] text-[#4A5568] dark:text-white font-bold text-base placeholder:text-[#718096] focus:border-[#88D8B0] dark:focus:border-[#88D8B0] focus:outline-none transition-all shadow-solid-sm"
                  placeholder="Nhập lại mật khẩu"
                  whileFocus={{ scale: 1.02, borderColor: "#88D8B0" }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#88D8B0]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={22} strokeWidth={2.5} />
                  ) : (
                    <Eye size={22} strokeWidth={2.5} />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-3 p-4 bg-[#D4F0F0]/30 dark:bg-gray-800/30 rounded-[20px] border-2 border-[#B5DEFF]/50 dark:border-gray-700"
            >
              <motion.input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-6 w-6 rounded-xl border-4 border-gray-300 dark:border-gray-600 text-[#88D8B0] focus:ring-[#88D8B0] focus:ring-2 bg-white dark:bg-[#1F1D24] mt-0.5 cursor-pointer"
                whileTap={{ scale: 0.9 }}
              />
              <div className="text-sm">
                <label
                  htmlFor="terms"
                  className="font-semibold text-[#718096] dark:text-gray-400 cursor-pointer"
                >
                  Bằng việc đăng ký, bạn đồng ý với{" "}
                  <Link
                    to="/terms"
                    className="font-black text-[#88D8B0] hover:text-[#6FCF97] underline"
                  >
                    Điều khoản Dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy"
                    className="font-black text-[#88D8B0] hover:text-[#6FCF97] underline"
                  >
                    Chính sách Bảo mật
                  </Link>{" "}
                  của chúng tôi 📜
                </label>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full h-16 rounded-full font-black text-xl transition-all flex items-center justify-center gap-3 shadow-solid-primary ${
                loading
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] text-[#2C3E50] hover:shadow-solid-primary-hover"
              }`}
              variants={itemVariants}
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.95, y: 0 } : {}}
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
                    <Sparkles size={24} strokeWidth={2.5} />
                  </motion.div>
                  <span>Đang đăng ký...</span>
                </>
              ) : (
                <>
                  <Star size={24} strokeWidth={2.5} />
                  <span>Đăng ký ngay</span>
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

          {/* Login Link */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700"
          >
            <p className="text-[#718096] dark:text-gray-400 text-base font-semibold">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-black text-[#FFB7B2] hover:text-[#FF9E98] underline"
              >
                Đăng nhập ngay 🎀
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Decoration */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 text-[#718096] dark:text-gray-600 text-sm font-bold"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Chào mừng đến với MemoHub 💖 ✨
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}
