import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dropzone from "./components/Dropzone";
import ImagePreview from "./components/ImagePreview";
import ResultDashboard from "./components/ResultDashboard";
import HistorySidebar from "./components/HistorySidebar";
import Toast from "./components/Toast";

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history & theme on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("docu_ocr_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Sync theme attribute to HTML document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleFileSelected = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setResult([]);
    showToast(`Loaded ${selectedFile.name}`, "info");
  };

  const handleClearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setResult([]);
  };

  const handleRunOcr = async () => {
    if (!file) {
      showToast("Please select a document image first.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/ocr/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("OCR request failed on backend.");
      }

      const data = await response.json();
      console.log("OCR API Response:", data);

      const extractedText = Array.isArray(data.text) ? data.text : [data.text];
      setResult(extractedText);
      showToast("Text extracted successfully!", "success");

      // Save to history
      const newHistoryItem = {
        id: Date.now().toString(),
        filename: file.name,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString(),
        text: extractedText,
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem("docu_ocr_history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error("OCR Request Error:", err);
      showToast("OCR processing failed. Make sure backend is running!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadHistoryItem = (item) => {
    setResult(item.text);
    showToast(`Loaded result for ${item.filename}`, "info");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("docu_ocr_history");
    showToast("Cleared scan history.", "info");
  };

  const handleDeleteHistoryItem = (id) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("docu_ocr_history", JSON.stringify(updated));
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        scanCount={history.length}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isHistoryOpen={isHistoryOpen}
      />

      {/* Main Workspace Studio */}
      <main className="main-content">
        <div className="grid-layout">
          {/* Left Column: File Dropzone / Live Scanner Preview */}
          <div>
            {!file ? (
              <Dropzone onFileSelected={handleFileSelected} disabled={loading} />
            ) : (
              <ImagePreview
                file={file}
                previewUrl={previewUrl}
                loading={loading}
                onClearFile={handleClearFile}
                onRunOcr={handleRunOcr}
              />
            )}
          </div>

          {/* Right Column: OCR Results & Analytics Dashboard */}
          <div>
            <ResultDashboard
              resultText={result}
              filename={file?.name}
              onShowToast={showToast}
            />
          </div>
        </div>
      </main>

      {/* History Slide-over */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;