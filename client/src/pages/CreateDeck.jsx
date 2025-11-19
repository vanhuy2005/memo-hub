import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { deckService } from "../services";

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
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate("/decks")}
          className="text-[#111813] dark:text-gray-200 flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12 text-gray-900 dark:text-white">
          Tạo Bộ Từ Mới
        </h2>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Field: Tên Bộ Từ */}
          <div className="flex flex-col">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-base font-medium leading-normal pb-2 text-gray-900 dark:text-white">
                Tên Bộ Từ
              </p>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111813] dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe6df] dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary/80 h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="Ví dụ: 100 từ tiếng Anh thông dụng"
              />
            </label>
          </div>

          {/* Text Field: Mô tả */}
          <div className="flex flex-col">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-base font-medium leading-normal pb-2 text-gray-900 dark:text-white">
                Mô tả (Tùy chọn)
              </p>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111813] dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe6df] dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary/80 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="Nhập mô tả cho bộ từ của bạn..."
              />
            </label>
          </div>

          {/* Checkbox: Public */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-white dark:bg-gray-800 mt-0.5"
            />
            <div className="text-sm">
              <label
                htmlFor="is_public"
                className="font-normal text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Công khai bộ từ này để người khác có thể sử dụng
              </label>
            </div>
          </div>
        </form>
      </main>

      {/* Footer with CTA Button */}
      <footer className="sticky bottom-0 bg-background-light dark:bg-background-dark p-4 pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary text-background-dark dark:text-background-dark font-bold py-4 px-6 rounded-lg text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang tạo..." : "Tạo Bộ Từ"}
        </button>
      </footer>
    </div>
  );
}
