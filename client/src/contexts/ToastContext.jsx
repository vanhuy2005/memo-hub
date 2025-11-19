import { createContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Toast from "../components/Toast";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, duration) => showToast(message, "success", duration),
    [showToast]
  );

  const error = useCallback(
    (message, duration) => showToast(message, "error", duration),
    [showToast]
  );

  const warning = useCallback(
    (message, duration) => showToast(message, "warning", duration),
    [showToast]
  );

  const info = useCallback(
    (message, duration) => showToast(message, "info", duration),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Toast Container with AnimatePresence */}
      <div className="fixed top-4 right-4 z-[99999] pointer-events-none">
        <motion.div className="flex flex-col gap-3 pointer-events-auto" layout>
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={() => hideToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </ToastContext.Provider>
  );
};
