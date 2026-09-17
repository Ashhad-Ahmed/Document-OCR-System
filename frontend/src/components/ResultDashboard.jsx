import React, { useState } from "react";
import {
  FileText,
  Copy,
  Download,
  Search,
  Check,
  Layers,
  Sparkles,
  Clock,
  Type,
  FileCode,
} from "lucide-react";

export default function ResultDashboard({ resultText, filename, onShowToast }) {
  const [activeTab, setActiveTab] = useState("blocks"); // 'blocks' | 'raw'
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // If no result yet
  if (!resultText || resultText.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "420px",
          textAlign: "center",
          padding: "3rem 2rem",
          color: "var(--text-muted)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.1)",
            color: "var(--accent-blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
        >
          <FileText size={36} />
        </div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.5rem" }}>
          No Document Scanned Yet
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "380px" }}>
          Select or drop a document image on the left side and click <b>Extract Document Text</b> to see results here.
        </p>
      </div>
    );
  }

  // Calculate stats
  const fullText = Array.isArray(resultText) ? resultText.join("\n") : String(resultText);
  const totalLines = Array.isArray(resultText) ? resultText.length : resultText.split("\n").length;
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const charCount = fullText.length;
  const estReadTime = Math.ceil(wordCount / 200);

  // Search filtering
  const linesList = Array.isArray(resultText) ? resultText : resultText.split("\n");
  const filteredLines = searchQuery.trim()
    ? linesList.filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
    : linesList;

  // Actions
  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    if (onShowToast) onShowToast("Copied extracted text to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([fullText], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `${filename || "ocr-result"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    if (onShowToast) onShowToast("Exported text file successfully!", "success");
  };

  const handleDownloadJson = () => {
    const data = {
      filename: filename || "document",
      extracted_at: new Date().toISOString(),
      stats: {
        total_lines: totalLines,
        word_count: wordCount,
        character_count: charCount,
      },
      text: linesList,
    };
    const element = document.createElement("a");
    const fileBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `${filename || "ocr-result"}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    if (onShowToast) onShowToast("Exported JSON file successfully!", "success");
  };

  return (
    <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Top Title & Stats Banner */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={20} style={{ color: "var(--accent-cyan)" }} />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
              Extracted Results
            </h3>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--accent-emerald)", background: "rgba(16, 185, 129, 0.1)", padding: "0.2rem 0.6rem", borderRadius: "999px", border: "1px solid rgba(16, 185, 129, 0.3)", fontWeight: 500 }}>
            ✓ Extraction Complete
          </span>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.75rem",
            background: "var(--bg-input)",
            padding: "0.85rem 1rem",
            borderRadius: "0.75rem",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Lines</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>{totalLines}</span>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Words</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>{wordCount}</span>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Characters</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)" }}>{charCount}</span>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Est. Read</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
              ~{estReadTime}m
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, View Switcher, Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        {/* View Mode Tabs */}
        <div style={{ display: "flex", background: "var(--bg-input)", padding: "0.25rem", borderRadius: "0.6rem" }}>
          <button
            onClick={() => setActiveTab("blocks")}
            style={{
              background: activeTab === "blocks" ? "var(--bg-secondary)" : "transparent",
              color: activeTab === "blocks" ? "var(--text-main)" : "var(--text-muted)",
              border: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "0.45rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Layers size={14} /> Blocks
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            style={{
              background: activeTab === "raw" ? "var(--bg-secondary)" : "transparent",
              color: activeTab === "raw" ? "var(--text-main)" : "var(--text-muted)",
              border: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "0.45rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <FileCode size={14} /> Raw Text
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button className="btn-secondary" onClick={handleCopy} title="Copy all text">
            {copied ? <Check size={15} style={{ color: "var(--accent-emerald)" }} /> : <Copy size={15} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button className="btn-secondary" onClick={handleDownloadTxt} title="Export TXT file">
            <Download size={15} />
            <span>TXT</span>
          </button>

          <button className="btn-secondary" onClick={handleDownloadJson} title="Export JSON file">
            <Download size={15} />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ position: "relative" }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "0.85rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
          }}
        />
        <input
          type="text"
          placeholder="Search extracted text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            borderRadius: "0.65rem",
            padding: "0.6rem 0.85rem 0.6rem 2.4rem",
            color: "var(--text-main)",
            fontSize: "0.88rem",
            outline: "none",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>

      {/* Content Views */}
      {activeTab === "blocks" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            maxHeight: "440px",
            overflowY: "auto",
            paddingRight: "0.2rem",
          }}
        >
          {filteredLines.length > 0 ? (
            filteredLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  background: "var(--bg-input)",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.6rem",
                  border: "1px solid var(--border-color)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-subtle)",
                    minWidth: "24px",
                  }}
                >
                  #{idx + 1}
                </span>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-main)",
                    margin: 0,
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                  }}
                >
                  {line}
                </p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
              No text lines matched "{searchQuery}"
            </p>
          )}
        </div>
      ) : (
        <textarea
          value={fullText}
          readOnly
          style={{
            width: "100%",
            height: "380px",
            background: "var(--bg-input)",
            color: "var(--text-main)",
            border: "1px solid var(--border-color)",
            borderRadius: "0.65rem",
            padding: "1rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.88rem",
            lineHeight: "1.6",
            resize: "vertical",
            outline: "none",
          }}
        />
      )}
    </div>
  );
}
