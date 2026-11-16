import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'warning' | 'error';
}

interface ToastContextValue {
  showToast: (text: string, type?: 'info' | 'warning' | 'error') => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-2), { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="liquid-glass text-text-main text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg border border-white/20 backdrop-blur-md text-center transition-all animate-fade-in"
          >
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
