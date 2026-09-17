import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    console.log("Selected file:", selectedFile);

    if (selectedFile) {
      setFile(selectedFile);
      setResult([]);
      setError("");
    }
  };

  const handleUpload = async () => {
    console.log("Upload button clicked");

    if (!file) {
      setError("Please select an image first.");
      return;
    }

    console.log("File:", file);

    const formData = new FormData();
    formData.append("file", file);

    console.log("Sending request to OCR API...");

    try {
      setLoading(true);
      setError("");
      setResult([]);

      const response = await fetch(
        "http://127.0.0.1:8000/api/ocr/",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("Response received:", response);

      if (!response.ok) {
        throw new Error("OCR request failed.");
      }

      const data = await response.json();

      console.log("OCR response:", data);

      setResult(data.text);
    } catch (error) {
      console.error("OCR request failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Document OCR System</h1>

      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
      />

      {file && <p>Selected file: {file.name}</p>}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Extract Text"}
      </button>

      {error && <p>{error}</p>}

      {result.length > 0 && (
        <div>
          <h2>Extracted Text</h2>

          {result.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;