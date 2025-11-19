import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center border-2 border-pink-200 dark:border-pink-800">
            {/* Cute Error Icon */}
            <div className="mb-6 animate-bounce">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full">
                <AlertTriangle
                  size={40}
                  className="text-pink-600 dark:text-pink-400"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ôi không! 😢
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Có gì đó không ổn rồi...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Đừng lo, chúng mình sẽ sửa ngay! 💪
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 mb-2">
                  Chi tiết lỗi (chỉ hiện trong dev mode)
                </summary>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs overflow-auto max-h-40">
                  <p className="text-red-800 dark:text-red-300 font-mono break-words">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-red-700 dark:text-red-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <RefreshCw size={20} strokeWidth={2.5} />
                Thử lại nào! ✨
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-full py-3 px-6 font-semibold transition-all"
              >
                <Home size={20} strokeWidth={2.5} />
                Về trang chủ
              </button>
            </div>

            {/* Cute illustration */}
            <div className="mt-6 text-6xl opacity-50">🎀</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
