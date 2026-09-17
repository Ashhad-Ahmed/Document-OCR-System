import React from "react";
import { X, Trash2, Clock, FileText, ArrowRight } from "lucide-react";

export default function HistorySidebar({ isOpen, onClose, history, onLoadItem, onClearHistory, onDeleteItem }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "380px",
        maxWidth: "90vw",
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border-color)",
        boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.5)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Clock size={20} style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
            Scan History
          </h3>
        </div>
        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ padding: "0.4rem", borderRadius: "50%" }}
        >
          <X size={18} />
        </button>
      </div>

      {/* History Items List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
        }}
      >
        {history && history.length > 0 ? (
          history.map((item) => (
            <div
              key={item.id}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                borderRadius: "0.75rem",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                transition: "border-color 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FileText size={18} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    {item.filename}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-subtle)",
                    cursor: "pointer",
                    padding: "0.2rem",
                  }}
                  title="Delete scan"
                >
                  <Trash2 size={15} style={{ color: "var(--accent-rose)" }} />
                </button>
              </div>

              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: "0.75rem" }}>
                <span>{item.date}</span>
                <span>•</span>
                <span>{Array.isArray(item.text) ? item.text.length : 1} lines</span>
              </div>

              <button
                className="btn-secondary"
                onClick={() => {
                  onLoadItem(item);
                  onClose();
                }}
                style={{
                  marginTop: "0.3rem",
                  width: "100%",
                  justifyContent: "space-between",
                  fontSize: "0.82rem",
                }}
              >
                <span>Load into workspace</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 1rem" }}>
            <p style={{ fontSize: "0.9rem" }}>No scan history yet.</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "0.5rem" }}>
              Documents you extract will automatically save here.
            </p>
          </div>
        )}
      </div>

      {/* Footer Clear All */}
      {history && history.length > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border-color)" }}>
          <button
            className="btn-secondary"
            onClick={onClearHistory}
            style={{ width: "100%", justifyContent: "center", color: "var(--accent-rose)", borderColor: "rgba(244, 63, 94, 0.3)" }}
          >
            <Trash2 size={16} />
            <span>Clear All History</span>
          </button>
        </div>
      )}
    </div>
  );
}
