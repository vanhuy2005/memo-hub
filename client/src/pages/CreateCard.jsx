import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { cardService } from "../services";

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

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200/80 dark:border-gray-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4">
        <button
          onClick={() => navigate(`/decks/${deckId}`)}
          className="flex size-10 items-center justify-center rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-gray-100 pr-10">
          {isEditing ? "Chỉnh sửa Thẻ" : "Thêm Thẻ Mới"}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 pb-32">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md mx-auto"
        >
          {/* Front Card Field */}
          <label className="flex flex-col w-full">
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Mặt Trước Thẻ *
            </p>
            <input
              type="text"
              name="front_content"
              value={formData.front_content}
              onChange={handleChange}
              required
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
              placeholder="Nhập từ vựng..."
            />
          </label>

          {/* Back Card Field */}
          <label className="flex flex-col w-full">
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Mặt Sau Thẻ *
            </p>
            <textarea
              name="back_content"
              value={formData.back_content}
              onChange={handleChange}
              required
              rows={4}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
              placeholder="Định nghĩa, dịch nghĩa..."
            />
          </label>

          {/* Pronunciation Field */}
          <label className="flex flex-col w-full">
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Phiên âm (tùy chọn)
            </p>
            <input
              type="text"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
              placeholder="Ví dụ: /həˈləʊ/"
            />
          </label>

          {/* Example Sentence Field */}
          <label className="flex flex-col w-full">
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">
              Câu ví dụ (tùy chọn)
            </p>
            <textarea
              name="example_sentence"
              value={formData.example_sentence}
              onChange={handleChange}
              rows={3}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
              placeholder="Nhập câu ví dụ sử dụng từ này..."
            />
          </label>
        </form>
      </main>

      {/* Bottom Action Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-gray-200/80 dark:border-gray-800/80">
        <div className="flex items-center gap-3 w-full max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-primary text-primary dark:text-primary bg-transparent text-base font-bold leading-normal transition-colors hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? "Lưu thay đổi" : "Hoàn thành"}
          </button>
          {!isEditing && (
            <button
              onClick={handleAddAnother}
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-primary text-gray-900 dark:text-gray-900 text-base font-bold leading-normal transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm Thẻ
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
