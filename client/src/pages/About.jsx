import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center p-4 justify-between">
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-800 dark:text-gray-200 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">
                arrow_back
              </span>
            </button>
            <h1 className="text-lg lg:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-gray-900 dark:text-white pr-10">
              Về MemoHub
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 lg:p-6 pb-24">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Logo Section */}
          <div className="p-8 text-center border-b border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-gray-900">
                psychology
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              MemoHub
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Phiên bản 1.0.0</p>
          </div>

          {/* Description */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
                Giới thiệu
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                MemoHub là ứng dụng học từ vựng thông minh sử dụng thuật toán
                học tập ngắt quãng (Spaced Repetition System - SRS) để tối ưu
                hóa quá trình ghi nhớ. Ứng dụng giúp bạn học từ vựng hiệu quả
                hơn bằng cách lên lịch ôn tập dựa trên mức độ thành thạo của
                từng từ.
              </p>
            </div>

            <div>
              <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
                Tính năng chính
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-primary mr-2 mt-0.5">
                    check_circle
                  </span>
                  <span>Thuật toán SRS (SM-2) thông minh</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-primary mr-2 mt-0.5">
                    check_circle
                  </span>
                  <span>Tạo và quản lý bộ từ vựng tùy chỉnh</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-primary mr-2 mt-0.5">
                    check_circle
                  </span>
                  <span>Thống kê chi tiết tiến trình học tập</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-primary mr-2 mt-0.5">
                    check_circle
                  </span>
                  <span>Nhắc nhở học tập hàng ngày</span>
                </li>
                <li className="flex items-start">
                  <span className="material-symbols-outlined text-primary mr-2 mt-0.5">
                    check_circle
                  </span>
                  <span>Giao diện thân thiện, responsive</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
                Liên hệ
              </h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="flex items-center">
                  <span className="material-symbols-outlined text-primary mr-2">
                    mail
                  </span>
                  <span>support@memohub.com</span>
                </p>
                <p className="flex items-center">
                  <span className="material-symbols-outlined text-primary mr-2">
                    language
                  </span>
                  <span>www.memohub.com</span>
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                © 2024 MemoHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
