import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
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
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <img
              src="/fav-icon.png"
              alt="MemoHub Logo"
              className="w-12 h-12 object-contain"
            />
            <h2 className="text-3xl font-bold text-[#111813] dark:text-white">
              MemoHub
            </h2>
          </div>
          <h1 className="text-[#111813] dark:text-white tracking-light text-[32px] font-bold leading-tight pt-6">
            Chào mừng trở lại!
          </h1>
          <p className="text-[#61896f] dark:text-gray-400 text-base font-normal leading-normal">
            Đăng nhập để tiếp tục hành trình của bạn.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111813] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Email
              </p>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111813] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe6df] dark:border-gray-700 bg-white dark:bg-background-dark/50 focus:border-primary h-14 placeholder:text-[#61896f] p-[15px] text-base font-normal leading-normal"
                placeholder="Nhập email của bạn"
              />
            </label>
          </div>

          <div className="flex flex-col">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#111813] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Mật khẩu
              </p>
              <div className="flex w-full flex-1 items-stretch rounded-xl">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-xl text-[#111813] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe6df] dark:border-gray-700 bg-white dark:bg-background-dark/50 focus:border-primary h-14 placeholder:text-[#61896f] p-[15px] border-r-0 pr-2 text-base font-normal leading-normal"
                  placeholder="Nhập mật khẩu của bạn"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#61896f] dark:text-gray-400 flex border border-[#dbe6df] dark:border-gray-700 bg-white dark:bg-background-dark/50 items-center justify-center pr-[15px] rounded-r-xl border-l-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>
            <div className="w-full flex justify-end pt-2">
              <Link
                to="/forgot-password"
                className="text-[#61896f] dark:text-gray-400 text-sm font-normal leading-normal underline hover:text-primary dark:hover:text-primary"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 px-6 bg-primary text-[#102216] font-bold text-lg rounded-xl flex items-center justify-center transition-transform active:scale-95 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[#61896f] dark:text-gray-400 text-base">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-bold text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
