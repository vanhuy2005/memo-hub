import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark overflow-x-hidden p-4 font-display">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <img
            src="/fav-icon.png"
            alt="MemoHub Logo"
            className="mx-auto w-16 h-16 object-contain"
          />
          <h1 className="text-text-light-primary dark:text-text-dark-primary tracking-tight text-3xl font-bold leading-tight pt-4">
            Tạo tài khoản mới
          </h1>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal pt-2">
            Chào mừng bạn! Hãy bắt đầu hành trình học ngôn ngữ của mình.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <p className="text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal pb-2">
              Tên người dùng
            </p>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark h-14 placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary p-[15px] text-base font-normal leading-normal"
              placeholder="Nhập tên người dùng của bạn"
            />
          </label>

          <label className="flex flex-col">
            <p className="text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal pb-2">
              Email
            </p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark h-14 placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary p-[15px] text-base font-normal leading-normal"
              placeholder="Nhập địa chỉ email"
            />
          </label>

          <label className="flex flex-col">
            <p className="text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal pb-2">
              Mật khẩu
            </p>
            <div className="relative flex w-full flex-1 items-stretch">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark h-14 placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary p-[15px] pr-12 text-base font-normal leading-normal"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-light-secondary dark:text-text-dark-secondary"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </label>

          <label className="flex flex-col">
            <p className="text-text-light-primary dark:text-text-dark-primary text-base font-medium leading-normal pb-2">
              Xác nhận mật khẩu
            </p>
            <div className="relative flex w-full flex-1 items-stretch">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-white dark:bg-background-dark h-14 placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary p-[15px] pr-12 text-base font-normal leading-normal"
                placeholder="Nhập lại mật khẩu của bạn"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-light-secondary dark:text-text-dark-secondary"
              >
                <span className="material-symbols-outlined">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </label>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-5 w-5 rounded border-border-light dark:border-border-dark text-primary focus:ring-primary bg-background-light dark:bg-background-dark mt-0.5"
            />
            <div className="text-sm">
              <label
                htmlFor="terms"
                className="font-normal text-text-light-secondary dark:text-text-dark-secondary"
              >
                Bằng việc đăng ký, bạn đồng ý với{" "}
                <Link
                  to="/terms"
                  className="font-medium text-primary hover:underline"
                >
                  Điều khoản Dịch vụ
                </Link>{" "}
                và{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-primary hover:underline"
                >
                  Chính sách Bảo mật
                </Link>{" "}
                của chúng tôi.
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded bg-primary py-3.5 text-base font-bold text-black dark:text-black hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-text-light-secondary dark:text-text-dark-secondary">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
