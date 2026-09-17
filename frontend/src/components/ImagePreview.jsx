import React, { useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, Scan, FileText, CheckCircle } from "lucide-react";

export default function ImagePreview({ file, previewUrl, loading, onClearFile, onRunOcr }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header Info & Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>
            Document Preview
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
            {file?.name} ({formatFileSize(file?.size)})
          </p>
        </div>

        {/* Toolbar buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <button className="btn-secondary" onClick={handleZoomOut} title="Zoom Out" style={{ padding: "0.4rem 0.6rem" }}>
            <ZoomOut size={16} />
          </button>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", minWidth: "42px", textAlign: "center" }}>
            {Math.round(zoom * 100)}%
          </span>
          <button className="btn-secondary" onClick={handleZoomIn} title="Zoom In" style={{ padding: "0.4rem 0.6rem" }}>
            <ZoomIn size={16} />
          </button>
          <button className="btn-secondary" onClick={handleRotate} title="Rotate 90°" style={{ padding: "0.4rem 0.6rem" }}>
            <RotateCw size={16} />
          </button>
          <button className="btn-secondary" onClick={onClearFile} title="Change Document" style={{ padding: "0.4rem 0.7rem", color: "var(--accent-rose)" }}>
            <RefreshCw size={15} /> Change
          </button>
        </div>
      </div>

      {/* Image Scanner Canvas */}
      <div className="scanner-container">
        {loading && (
          <>
            <div className="laser-beam" />
            <div className="laser-overlay" />
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20,
                background: "rgba(9, 13, 22, 0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid var(--accent-cyan)",
                padding: "0.5rem 1.25rem",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "var(--accent-cyan)",
                fontSize: "0.85rem",
                fontWeight: 600,
                boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)",
              }}
            >
              <Scan size={18} className="pulse-glow" />
              <span>Scanning document text blocks...</span>
            </div>
          </>
        )}

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Uploaded Document Preview"
            className="scanner-image"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />
        )}
      </div>

      {/* Start Extraction Action Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn-primary"
          onClick={onRunOcr}
          disabled={loading}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
              <span>Extracting Text via AI...</span>
            </>
          ) : (
            <>
              <Scan size={18} />
              <span>Extract Document Text</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
