import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";

export type ToastVariant = "success" | "info" | "warning" | "error";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { bg: string; text: string; icon: string; iconBg: string }> = {
  success: {
    bg: "bg-white border-success/20",
    text: "text-on-surface",
    icon: "✓",
    iconBg: "bg-success-light text-success"
  },
  info: {
    bg: "bg-white border-outline",
    text: "text-on-surface",
    icon: "i",
    iconBg: "bg-primary-container text-primary"
  },
  warning: {
    bg: "bg-white border-warning/30",
    text: "text-on-surface",
    icon: "!",
    iconBg: "bg-amber-50 text-warning"
  },
  error: {
    bg: "bg-white border-danger/30",
    text: "text-on-surface",
    icon: "×",
    iconBg: "bg-red-50 text-danger"
  }
};

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const style = VARIANT_STYLES[toast.variant];

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 rounded-xl border ${style.bg} ${style.text} px-4 py-3 elevation-2 min-w-[280px] max-w-sm transition-all duration-200 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${style.iconBg}`}>
        {style.icon}
      </div>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-on-surface-2 hover:text-on-surface transition-colors text-xs shrink-0"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: () => {} };
  }
  return ctx;
};
