import { useNavigate } from "react-router-dom";

export default function Privacy() {
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
              Chính sách bảo mật
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
              MemoHub cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của người
              dùng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng
              và bảo vệ thông tin của bạn.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              1. Thông tin chúng tôi thu thập
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>
                Thông tin tài khoản: email, tên người dùng, mật khẩu (được mã
                hóa)
              </li>
              <li>Dữ liệu học tập: bộ từ vựng, tiến trình học, thống kê</li>
              <li>
                Thông tin thiết bị: loại thiết bị, hệ điều hành, phiên bản ứng
                dụng
              </li>
              <li>Dữ liệu sử dụng: thời gian truy cập, tính năng sử dụng</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              2. Cách chúng tôi sử dụng thông tin
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Cung cấp và cải thiện dịch vụ</li>
              <li>Cá nhân hóa trải nghiệm học tập</li>
              <li>Gửi thông báo về tiến trình học tập</li>
              <li>Phân tích và cải thiện hiệu suất ứng dụng</li>
              <li>Bảo mật tài khoản và phát hiện gian lận</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              3. Bảo vệ dữ liệu
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn ngành như mã
              hóa SSL/TLS, mã hóa mật khẩu (bcrypt), và xác thực JWT. Dữ liệu
              được lưu trữ trên các máy chủ bảo mật và chỉ nhân viên được ủy
              quyền mới có quyền truy cập.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              4. Chia sẻ thông tin
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              MemoHub không bán hoặc chia sẻ thông tin cá nhân của bạn cho bên
              thứ ba vì mục đích quảng cáo. Chúng tôi chỉ chia sẻ thông tin khi:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside mt-2">
              <li>Bạn đồng ý</li>
              <li>Tuân thủ yêu cầu pháp lý</li>
              <li>Bảo vệ quyền và an toàn của MemoHub</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              5. Quyền của bạn
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Bạn có quyền:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-inside mt-2">
              <li>Truy cập và cập nhật thông tin cá nhân</li>
              <li>Xóa tài khoản và dữ liệu</li>
              <li>Xuất dữ liệu học tập của bạn</li>
              <li>Từ chối nhận thông báo marketing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-bold mb-3">
              6. Liên hệ
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ:
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2 flex items-center">
              <span className="material-symbols-outlined text-primary mr-2">
                mail
              </span>
              privacy@memohub.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
