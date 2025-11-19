import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { cardService } from "../services";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Sparkles, Plus } from "lucide-react";

export default function CreateCard() {
  const { deckId, cardId } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    deck_id: deckId,
    front_content: "",
    back_content: "",
    pronunciation: "",
    example_sentence: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadCard = useCallback(async () => {
    try {
      const data = await cardService.getCardById(cardId);
      const card = data.data.card;
      setFormData({
        deck_id: card.deck_id,
        front_content: card.front_content,
        back_content: card.back_content,
        pronunciation: card.pronunciation || "",
        example_sentence: card.example_sentence || "",
      });
    } catch (err) {
      console.error("Error loading card:", err);
      error("😢 Không thể tải thông tin thẻ");
      navigate(`/decks/${deckId}`);
    }
  }, [cardId, deckId, navigate, error]);

  useEffect(() => {
    if (cardId) {
      setIsEditing(true);
      loadCard();
    }
  }, [cardId, loadCard]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.front_content.trim() || !formData.back_content.trim()) {
      error("✏️ Vui lòng nhập đầy đủ nội dung mặt trước và mặt sau");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await cardService.updateCard(cardId, formData);
        success("✨ Cập nhật thẻ thành công!");
      } else {
        await cardService.createCard(formData);
        success("✨ Tạo thẻ thành công!");
      }
      setTimeout(() => navigate(`/decks/${deckId}`), 500);
    } catch (err) {
      console.error("Error saving card:", err);
      error(
        err.response?.data?.message || "😢 Không thể lưu thẻ. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = async (e) => {
    e.preventDefault();

    if (!formData.front_content.trim() || !formData.back_content.trim()) {
      error("✏️ Vui lòng nhập đầy đủ nội dung mặt trước và mặt sau");
      return;
    }

    setLoading(true);
    try {
      await cardService.createCard(formData);
      // Reset form
      setFormData({
        deck_id: deckId,
        front_content: "",
        back_content: "",
        pronunciation: "",
        example_sentence: "",
      });
      success("✨ Đã thêm thẻ thành công! Tiếp tục thêm thẻ mới nhé 💖");
    } catch (err) {
      console.error("Error creating card:", err);
      error(
        err.response?.data?.message || "😢 Không thể tạo thẻ. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
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

  return (
    <motion.div
      className="relative flex h-auto min-h-screen w-full flex-col font-display bg-[#FEFBF6] dark:bg-[#2D2A32] overflow-x-hidden pb-32"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {["🎴", "✨", "💫", "🌟", "⭐", "💖"].map((emoji, i) => (
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
            onClick={() => navigate(`/decks/${deckId}`)}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-soft hover:shadow-pop transition-all"
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="text-primary" size={24} strokeWidth={2.5} />
          </motion.button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard
              className="text-purple-500"
              size={28}
              strokeWidth={2.5}
            />
            {isEditing ? "Chỉnh sửa Thẻ" : "Thêm Thẻ Mới"}
          </h1>
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
              Nội dung thẻ 🎴
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Front Card Field */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                🎴 Mặt Trước Thẻ *
              </label>
              <motion.input
                type="text"
                name="front_content"
                value={formData.front_content}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-[20px] border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base focus:border-primary dark:focus:border-primary focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="Nhập từ vựng..."
                whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
              />
            </motion.div>

            {/* Back Card Field */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                📝 Mặt Sau Thẻ *
              </label>
              <motion.textarea
                name="back_content"
                value={formData.back_content}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-6 py-4 rounded-[20px] border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base focus:border-primary dark:focus:border-primary focus:outline-none transition-all placeholder:text-gray-400 resize-none"
                placeholder="Định nghĩa, dịch nghĩa..."
                whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
              />
            </motion.div>

            {/* Pronunciation Field */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                🔊 Phiên âm (tùy chọn)
              </label>
              <motion.input
                type="text"
                name="pronunciation"
                value={formData.pronunciation}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-[20px] border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base focus:border-primary dark:focus:border-primary focus:outline-none transition-all placeholder:text-gray-400"
                placeholder="Ví dụ: /həˈləʊ/"
                whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
              />
            </motion.div>

            {/* Example Sentence Field */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
                💬 Câu ví dụ (tùy chọn)
              </label>
              <motion.textarea
                name="example_sentence"
                value={formData.example_sentence}
                onChange={handleChange}
                rows={3}
                className="w-full px-6 py-4 rounded-[20px] border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-base focus:border-primary dark:focus:border-primary focus:outline-none transition-all placeholder:text-gray-400 resize-none"
                placeholder="Nhập câu ví dụ sử dụng từ này..."
                whileFocus={{ scale: 1.02, borderColor: "#a855f7" }}
              />
            </motion.div>
          </form>
        </motion.div>
      </main>

      {/* Floating Action Buttons */}
      <motion.div
        className="fixed bottom-20 left-0 right-0 z-20 px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {!isEditing && (
            <motion.button
              onClick={handleAddAnother}
              disabled={loading}
              className={`flex-1 h-16 rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-pop transition-all ${
                loading
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-400 to-emerald-400 text-white hover:shadow-glow"
              }`}
              whileHover={!loading ? { scale: 1.02, y: -3 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
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
                  <span>Đang thêm...</span>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus size={24} strokeWidth={2.5} />
                  </motion.div>
                  <span>Thêm Tiếp</span>
                </>
              )}
            </motion.button>
          )}

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className={`${
              !isEditing ? "flex-1" : "w-full"
            } h-16 rounded-full font-black text-xl flex items-center justify-center gap-3 shadow-pop transition-all ${
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
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <CreditCard size={24} strokeWidth={2.5} />
                <span>{isEditing ? "Lưu thay đổi" : "Hoàn thành"}</span>
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
