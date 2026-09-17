import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} style={{ color: "var(--accent-emerald)" }} />,
    error: <AlertCircle size={18} style={{ color: "var(--accent-rose)" }} />,
    info: <Info size={18} style={{ color: "var(--accent-cyan)" }} />,
  };

  return (
    <div className="toast-popup">
      {icons[toast.type] || icons.info}
      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginLeft: "0.5rem"
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
