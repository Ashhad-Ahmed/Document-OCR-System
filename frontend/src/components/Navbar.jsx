import React from "react";
import { Sparkles, Moon, Sun, History, FileText } from "lucide-react";

export default function Navbar({ theme, toggleTheme, scanCount, onToggleHistory, isHistoryOpen }) {
  return (
    <header
      style={{
        background: "rgba(17, 24, 39, 0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)",
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h1
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                DocuExtract <span style={{ color: "var(--accent-cyan)" }}>AI</span>
              </h1>
              <span className="status-badge">
                <span className="pulse-dot"></span>
                FastAPI OCR v1.0
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
              High-Precision Document Text Recognition
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* History Button */}
          <button
            onClick={onToggleHistory}
            className="btn-secondary"
            title="Scan History"
            style={{
              borderColor: isHistoryOpen ? "var(--accent-cyan)" : "var(--border-color)",
            }}
          >
            <History size={16} />
            <span>History</span>
            {scanCount > 0 && (
              <span
                style={{
                  background: "var(--accent-cyan)",
                  color: "#000",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.1rem 0.45rem",
                  borderRadius: "999px",
                  marginLeft: "0.2rem",
                }}
              >
                {scanCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            title="Toggle Light/Dark Theme"
            style={{ padding: "0.6rem" }}
          >
            {theme === "dark" ? <Sun size={18} style={{ color: "#f59e0b" }} /> : <Moon size={18} style={{ color: "#6366f1" }} />}
          </button>
        </div>
      </div>
    </header>
  );
}
