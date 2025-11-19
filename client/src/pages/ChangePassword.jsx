import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import { ArrowLeft, Lock, Eye, EyeOff, Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  // Calculate password strength (0-100)
  const calculateStrength = () => {
    const pw = formData.newPassword;
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 6) strength += 33;
    if (pw.length >= 10) strength += 17;
    if (/[A-Z]/.test(pw)) strength += 17;
    if (/[a-z]/.test(pw)) strength += 17;
    if (/[0-9]/.test(pw)) strength += 16;
    return Math.min(strength, 100);
  };

  const getStrengthColor = () => {
    const strength = calculateStrength();
    if (strength < 33) return "from-red-500 to-red-400";
    if (strength < 66) return "from-yellow-500 to-yellow-400";
    return "from-green-500 to-green-400";
  };

  const getStrengthLabel = () => {
    const strength = calculateStrength();
    if (strength < 33) return "🔴 Yếu";
    if (strength < 66) return "🟡 Vừa";
    return "🟢 Mạnh";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đổi mật khẩu thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative flex min-h-screen w-full flex-col bg-[#FEFBF6] dark:bg-[#2D2A32] font-display overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating Emojis */}
      {["🔒", "✨", "🛡️", "🔑", "🌟", "💎"].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20 pointer-events-none"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 90 + 5}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b-4 border-white/50 dark:border-purple-700/30 shadow-soft"
      >
        <div className="flex items-center p-4 justify-between max-w-5xl mx-auto">
          <motion.button
            onClick={() => navigate("/profile")}
            className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="text-primary" size={24} strokeWidth={2.5} />
          </motion.button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="text-green-500" size={28} strokeWidth={2.5} />
            Đổi mật khẩu
          </h1>
          <div className="w-12"></div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="relative z-10 flex-1 px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Icon Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center space-y-4 pb-4"
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center shadow-glow"
              animate={error ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Lock
                size={48}
                className="text-green-600 dark:text-green-400"
                strokeWidth={2.5}
              />
            </motion.div>
            <p className="text-center text-base font-semibold text-gray-700 dark:text-gray-300">
              Nhập mật khẩu hiện tại và mật khẩu mới của bạn 🔑
            </p>
          </motion.div>

          {/* Success Message */}
          {success && (
            <motion.div
              className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-4 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-6 py-4 rounded-[24px] font-bold shadow-glow"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ✅
                </motion.span>
                <span>
                  Đổi mật khẩu thành công! Đang chuyển về trang cá nhân...
                </span>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 border-4 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 px-6 py-4 rounded-[24px] font-bold shadow-pop"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  ❌
                </motion.span>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                🔑 Mật khẩu hiện tại
              </label>
              <div className="relative">
                <motion.input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 pr-14 bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 rounded-[20px] focus:border-primary dark:focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-semibold text-base placeholder:text-gray-400"
                  placeholder="Nhập mật khẩu hiện tại"
                  whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={22} strokeWidth={2.5} />
                  ) : (
                    <Eye size={22} strokeWidth={2.5} />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* New Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                ✨ Mật khẩu mới
              </label>
              <div className="relative">
                <motion.input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-6 py-4 pr-14 bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 rounded-[20px] focus:border-primary dark:focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-semibold text-base placeholder:text-gray-400"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showNewPassword ? (
                    <EyeOff size={22} strokeWidth={2.5} />
                  ) : (
                    <Eye size={22} strokeWidth={2.5} />
                  )}
                </motion.button>
              </div>
              {/* Password Strength Bar */}
              {formData.newPassword && (
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      Độ mạnh:
                    </span>
                    <span className="text-xs font-black">
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getStrengthColor()} shadow-glow`}
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateStrength()}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                🔒 Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <motion.input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 pr-14 bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 rounded-[20px] focus:border-primary dark:focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white font-semibold text-base placeholder:text-gray-400"
                  placeholder="Nhập lại mật khẩu mới"
                  whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
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

            {/* Password Requirements */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-4 border-blue-200 dark:border-blue-800 rounded-[24px] p-6 shadow-pop"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles
                    className="text-blue-500"
                    size={24}
                    strokeWidth={2.5}
                  />
                </motion.div>
                <p className="text-base font-black text-blue-900 dark:text-blue-300">
                  Yêu cầu mật khẩu:
                </p>
              </div>
              <ul className="text-sm font-semibold text-blue-800 dark:text-blue-400 space-y-2">
                <li className="flex items-center gap-3">
                  <motion.span
                    className={`text-lg ${
                      formData.newPassword.length >= 6
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                    animate={
                      formData.newPassword.length >= 6
                        ? { scale: [1, 1.3, 1] }
                        : {}
                    }
                  >
                    {formData.newPassword.length >= 6 ? "✓" : "○"}
                  </motion.span>
                  <span>Tối thiểu 6 ký tự</span>
                </li>
                <li className="flex items-center gap-3">
                  <motion.span
                    className={`text-lg ${
                      formData.newPassword === formData.confirmPassword &&
                      formData.confirmPassword
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                    animate={
                      formData.newPassword === formData.confirmPassword &&
                      formData.confirmPassword
                        ? { scale: [1, 1.3, 1] }
                        : {}
                    }
                  >
                    {formData.newPassword === formData.confirmPassword &&
                    formData.confirmPassword
                      ? "✓"
                      : "○"}
                  </motion.span>
                  <span>Mật khẩu xác nhận khớp</span>
                </li>
                <li className="flex items-center gap-3">
                  <motion.span
                    className={`text-lg ${
                      formData.currentPassword &&
                      formData.newPassword !== formData.currentPassword
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                    animate={
                      formData.currentPassword &&
                      formData.newPassword !== formData.currentPassword
                        ? { scale: [1, 1.3, 1] }
                        : {}
                    }
                  >
                    {formData.currentPassword &&
                    formData.newPassword !== formData.currentPassword
                      ? "✓"
                      : "○"}
                  </motion.span>
                  <span>Khác mật khẩu hiện tại</span>
                </li>
              </ul>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-2">
              <motion.button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 font-black text-base rounded-full shadow-soft"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Hủy
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading || success}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-base rounded-full shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
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
                      <Sparkles size={22} strokeWidth={2.5} />
                    </motion.div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Shield size={22} strokeWidth={2.5} />
                    <span>Đổi mật khẩu</span>
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
