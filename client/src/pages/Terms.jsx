import { useNavigate } from "react-router-dom";

export default function Terms() {
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
              Điều khoản dịch vụ
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 lg:p-6 pb-24">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Chào mừng bạn đến với MemoHub. Bằng việc sử dụng dịch vụ của chúng
              tôi, bạn đồng ý với các điều khoản sau đây.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              1. Chấp nhận điều khoản
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Khi truy cập và sử dụng MemoHub, bạn xác nhận rằng bạn đã đọc,
              hiểu và đồng ý bị ràng buộc bởi các điều khoản này. Nếu bạn không
              đồng ý, vui lòng không sử dụng dịch vụ.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              2. Tài khoản người dùng
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Bạn phải từ đủ 13 tuổi trở lên để sử dụng dịch vụ</li>
              <li>Bạn chịu trách nhiệm bảo mật thông tin tài khoản</li>
              <li>Một người chỉ được tạo một tài khoản</li>
              <li>Không được chia sẻ tài khoản cho người khác</li>
              <li>MemoHub có quyền đình chỉ tài khoản vi phạm</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              3. Nội dung người dùng
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              Bạn giữ quyền sở hữu nội dung mình tạo (bộ từ vựng, ghi chú). Tuy
              nhiên, bạn cấp cho MemoHub quyền sử dụng nội dung này để:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Cung cấp và cải thiện dịch vụ</li>
              <li>Hiển thị nội dung công khai (nếu bạn chọn)</li>
              <li>Tạo bản sao lưu và đảm bảo an toàn dữ liệu</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              Bạn cam kết không tải lên nội dung vi phạm bản quyền, bất hợp
              pháp, hoặc không phù hợp.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              4. Sử dụng chấp nhận được
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              Bạn đồng ý KHÔNG:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
              <li>Can thiệp hoặc phá vỡ hệ thống</li>
              <li>Thu thập dữ liệu người dùng khác</li>
              <li>Sao chép hoặc phân phối lại dịch vụ</li>
              <li>Sử dụng bot hoặc tự động hóa trái phép</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              5. Quyền sở hữu trí tuệ
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Tất cả quyền sở hữu trí tuệ về MemoHub (logo, thiết kế, mã nguồn,
              thuật toán) thuộc về chúng tôi. Bạn không được sao chép, sửa đổi,
              hoặc tái phân phối mà không có sự cho phép.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              6. Miễn trừ trách nhiệm
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              MemoHub được cung cấp &ldquo;nguyên trạng&rdquo;. Chúng tôi không
              đảm bảo dịch vụ sẽ không bị gián đoạn hoặc không có lỗi. Chúng tôi
              không chịu trách nhiệm về:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside mt-2">
              <li>Mất dữ liệu hoặc nội dung</li>
              <li>Lỗi kỹ thuật hoặc gián đoạn dịch vụ</li>
              <li>Thiệt hại gián tiếp từ việc sử dụng dịch vụ</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              7. Thay đổi điều khoản
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              MemoHub có quyền cập nhật điều khoản này bất kỳ lúc nào. Chúng tôi
              sẽ thông báo về các thay đổi quan trọng. Việc bạn tiếp tục sử dụng
              dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận điều khoản mới.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              8. Chấm dứt
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Bạn có thể xóa tài khoản bất kỳ lúc nào từ trang cài đặt. MemoHub
              có quyền đình chỉ hoặc chấm dứt tài khoản vi phạm điều khoản mà
              không cần thông báo trước.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              9. Liên hệ
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Nếu bạn có câu hỏi về điều khoản dịch vụ:
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2 flex items-center">
              <span className="material-symbols-outlined text-primary mr-2">
                mail
              </span>
              legal@memohub.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
