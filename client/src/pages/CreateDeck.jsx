import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { deckService } from "../services";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Sparkles, Globe } from "lucide-react";

export default function CreateDeck() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error("✏️ Vui lòng nhập tên bộ từ");
      return;
    }

    setLoading(true);
    try {
      const data = await deckService.createDeck(formData);
      success("✨ Tạo bộ từ thành công!");
      setTimeout(() => navigate(`/decks/${data.data.deck._id}`), 500);
    } catch (err) {
      console.error("Error creating deck:", err);
      error(
        err.response?.data?.message ||
          "😢 Không thể tạo bộ từ. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative flex h-auto min-h-screen w-full flex-col font-display bg-[#FEFBF6] dark:bg-[#2D2A32] overflow-x-hidden pb-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {["📝", "✏️", "📚", "✨", "🎨", "💡"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.4, 0.2],
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

      {/* Header */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b-4 border-white/50 dark:border-purple-700/30 shadow-soft"
      >
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto">
          <motion.button
            onClick={() => navigate("/decks")}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-soft hover:shadow-pop transition-all"
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="text-primary" size={24} strokeWidth={2.5} />
          </motion.button>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-purple-500" size={28} strokeWidth={2.5} />
            Tạo Bộ Từ Mới
          </h2>
          <div className="w-12"></div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col p-4 pt-6">
        <motion.div
          variants={itemVariants}
          className="max-w-2xl mx-auto w-full bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-pop border-4 border-white/50 dark:border-purple-700/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles
                className="text-yellow-500"
                size={32}
                strokeWidth={2.5}
              />
            </motion.div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              Thông tin bộ từ 📝
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Field: Tên Bộ Từ */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                📚 Tên Bộ Từ *
              </label>
              <motion.input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-[20px] border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base focus:border-primary dark:focus:border-primary focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="Ví dụ: 100 từ tiếng Anh thông dụng"
                whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
              />
            </motion.div>

            {/* Text Field: Mô tả */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                ✏️ Mô tả (Tùy chọn)
              </label>
              <motion.textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-6 py-4 rounded-[20px] border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base focus:border-primary dark:focus:border-primary focus:outline-none transition-all placeholder:text-gray-400 resize-none"
                placeholder="Nhập mô tả cho bộ từ của bạn..."
                whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
              />
            </motion.div>

            {/* Toggle Switch: Public */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between p-6 rounded-[20px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-3">
                <Globe className="text-blue-500" size={24} strokeWidth={2.5} />
                <div>
                  <p className="text-base font-black text-gray-900 dark:text-white">
                    Công khai bộ từ
                  </p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Cho phép người khác sử dụng
                  </p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, is_public: !formData.is_public })
                }
                className={`relative w-16 h-8 rounded-full transition-all ${
                  formData.is_public
                    ? "bg-gradient-to-r from-green-400 to-emerald-400 shadow-glow"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-soft"
                  animate={{
                    left: formData.is_public ? "calc(100% - 28px)" : "4px",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </main>

      {/* Floating Submit Button */}
      <motion.div
        className="fixed bottom-20 left-0 right-0 z-20 px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full h-16 rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-pop transition-all ${
              loading
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:shadow-glow"
            }`}
            whileHover={!loading ? { scale: 1.02, y: -3 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={24} />
                </motion.div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <BookOpen size={24} strokeWidth={2.5} />
                <span>Tạo Bộ Từ</span>
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
