import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { cardService } from "../services";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, Sparkles, Package } from "lucide-react";

export default function ImportCards() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { success, error, warning } = useToast();
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (
      !selectedFile.name.endsWith(".csv") &&
      !selectedFile.name.endsWith(".txt")
    ) {
      warning("⚠️ Vui lòng chọn file CSV hoặc TXT");
      return;
    }

    setFile(selectedFile);

    // Read and preview file
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      parseCSV(text);
    };
    reader.readAsText(selectedFile);
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

  const parseCSV = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const cards = [];

    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      // Support formats: "front,back" or "front;back" or "front|back" or "front\tback"
      const parts = line.split(/[,;\t|]/).map((p) => p.trim());

      if (parts.length >= 2) {
        cards.push({
          front: parts[0],
          back: parts[1],
          pronunciation: parts[2] || "",
          example: parts[3] || "",
        });
      }
    }

    setPreview(cards);
  };

  const handleImport = async () => {
    if (!file) {
      error("✏️ Vui lòng chọn file");
      return;
    }

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        const lines = text.split("\n").filter((line) => line.trim());

        let successCount = 0;
        let errorCount = 0;

        for (const line of lines) {
          const parts = line.split(/[,;\t|]/).map((p) => p.trim());

          if (parts.length >= 2) {
            try {
              await cardService.createCard(deckId, {
                front_content: parts[0],
                back_content: parts[1],
                pronunciation: parts[2] || "",
                example_sentence: parts[3] || "",
              });
              successCount++;
            } catch (error) {
              console.error("Error importing card:", error);
              errorCount++;
            }
          }
        }

        if (successCount > 0) {
          success(
            `✨ Nhập thành công ${successCount} thẻ${
              errorCount > 0 ? `, ${errorCount} thẻ lỗi` : ""
            }!`
          );
        } else {
          error("😢 Không có thẻ nào được nhập thành công");
        }
        setTimeout(() => navigate(`/decks/${deckId}`), 500);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error("Error importing cards:", err);
      error("😢 Có lỗi xảy ra khi nhập thẻ");
    } finally {
      setImporting(false);
    }
  };

  return (
    <motion.div
      className="relative flex min-h-screen w-full flex-col font-display bg-[#FEFBF6] dark:bg-[#2D2A32] overflow-x-hidden pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating Emojis */}
      {["📁", "✨", "📤", "💾", "🎴", "🌟"].map((emoji, i) => (
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
        <div className="flex items-center p-4 justify-between">
          <motion.button
            onClick={() => navigate(`/decks/${deckId}`)}
            className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="text-primary" size={24} strokeWidth={2.5} />
          </motion.button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-green-500" size={28} strokeWidth={2.5} />
            Nhập thẻ từ File
          </h1>
          <div className="w-12"></div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full p-4 lg:p-6 space-y-6">
        {/* Instructions */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-4 border-blue-200 dark:border-blue-800 rounded-[24px] p-6 shadow-pop"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="text-blue-500" size={28} strokeWidth={2.5} />
            </motion.div>
            <h3 className="font-black text-blue-900 dark:text-blue-300 text-lg">
              Hướng dẫn định dạng file
            </h3>
          </div>
          <ul className="text-sm font-semibold text-blue-800 dark:text-blue-200 space-y-2">
            <li>• Mỗi dòng là một thẻ</li>
            <li>
              • Định dạng:{" "}
              <code className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full font-bold">
                Mặt trước, Mặt sau, Phiên âm (tùy chọn), Ví dụ (tùy chọn)
              </code>
            </li>
            <li>
              • Có thể dùng dấu phân cách: dấu phẩy (,), chấm phẩy (;), tab hoặc
              gạch dọc (|)
            </li>
            <li>
              • Ví dụ:{" "}
              <code className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full font-bold">
                Hello, Xin chào, /həˈloʊ/, Hello everyone!
              </code>
            </li>
          </ul>
        </motion.div>

        {/* File Upload */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-[32px] shadow-pop border-4 border-white/50 dark:border-purple-700/30 p-8"
        >
          <motion.label
            className="flex flex-col items-center justify-center w-full h-56 border-8 border-dashed border-primary/50 dark:border-primary/40 rounded-[24px] cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
            whileHover={{ scale: 1.01, borderColor: "#a855f7" }}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Upload className="text-primary" size={72} strokeWidth={2.5} />
              </motion.div>
              <p className="text-base font-black text-gray-900 dark:text-white mt-6">
                {file ? "📄 File đã chọn" : "Kéo thả file CSV hoặc TXT vào đây"}
              </p>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2">
                Hoặc nhấp để chọn file
              </p>
            </div>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.label>

          {/* File Chip */}
          {file && (
            <motion.div
              className="flex items-center justify-center gap-3 mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full shadow-glow font-bold"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <FileText size={20} strokeWidth={2.5} />
              <span>{file.name}</span>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </motion.div>
          )}
        </motion.div>

        {/* Preview */}
        {preview.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-[32px] shadow-pop border-4 border-white/50 dark:border-purple-700/30 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles
                  className="text-yellow-500"
                  size={28}
                  strokeWidth={2.5}
                />
              </motion.div>
              <h3 className="text-gray-900 dark:text-gray-100 text-xl font-black">
                Xem trước (5 thẻ đầu tiên) 👀
              </h3>
            </div>
            <div className="space-y-4">
              {preview.map((card, idx) => (
                <motion.div
                  key={idx}
                  className="border-4 border-purple-200 dark:border-purple-700 rounded-[20px] p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                  initial={{ scale: 0, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-purple-600 dark:text-purple-400 text-xs font-black mb-2">
                        🎴 Mặt trước
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-bold">
                        {card.front}
                      </p>
                    </div>
                    <div>
                      <p className="text-pink-600 dark:text-pink-400 text-xs font-black mb-2">
                        📝 Mặt sau
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-bold">
                        {card.back}
                      </p>
                    </div>
                  </div>
                  {(card.pronunciation || card.example) && (
                    <div className="mt-3 pt-3 border-t-2 border-purple-200 dark:border-purple-700 text-xs font-semibold text-gray-700 dark:text-gray-300 space-y-1">
                      {card.pronunciation && (
                        <p>🔊 Phiên âm: {card.pronunciation}</p>
                      )}
                      {card.example && <p>💬 Ví dụ: {card.example}</p>}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Import Button */}
        <motion.button
          onClick={handleImport}
          disabled={!file || importing}
          className="w-full h-16 rounded-full bg-gradient-to-r from-[#88D8B0] via-[#FFB7B2] to-[#E0BBE4] text-white font-black text-lg shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
        >
          {importing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={24} strokeWidth={2.5} />
              </motion.div>
              <span>Đang nhập...</span>
            </>
          ) : (
            <>
              <Package size={24} strokeWidth={2.5} />
              <span>Nhập thẻ vào bộ từ</span>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </>
          )}
        </motion.button>
      </main>
    </motion.div>
  );
}
