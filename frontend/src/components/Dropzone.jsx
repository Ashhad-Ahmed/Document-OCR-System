import React, { useState, useRef } from "react";
import { UploadCloud, FileImage, ShieldCheck } from "lucide-react";

export default function Dropzone({ onFileSelected, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelected(file);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div
      className={`dropzone-box ${isDragOver ? "active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        style={{ display: "none" }}
        disabled={disabled}
      />

      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "rgba(56, 189, 248, 0.1)",
          color: "var(--accent-cyan)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem auto",
          border: "1px solid rgba(56, 189, 248, 0.2)",
        }}
      >
        <UploadCloud size={32} />
      </div>

      <h3
        style={{
          fontSize: "1.15rem",
          fontWeight: 600,
          color: "var(--text-main)",
          marginBottom: "0.5rem",
        }}
      >
        Drag & Drop your Document Image
      </h3>

      <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
        or <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>browse file</span> from your computer
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "1.25rem",
          fontSize: "0.78rem",
          color: "var(--text-subtle)",
          background: "var(--bg-input)",
          padding: "0.5rem 1rem",
          borderRadius: "999px",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <FileImage size={14} /> PNG, JPG, WEBP
        </span>
        <span>•</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <ShieldCheck size={14} /> High Precision OCR
        </span>
      </div>
    </div>
  );
}
