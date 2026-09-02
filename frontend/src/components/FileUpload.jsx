import { useState } from "react";
import apiClient from "../api/client";

function FileUpload({ onUploadComplete }){
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

      try {
    const response = await apiClient.post("/api/v1/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setMessages((prev) => [
      ...prev,
      `${file.name}: uploaded, processing (document_id: ${response.data.document_id})`,
    ]);
    onUploadComplete();
  } catch (err) {
    setMessages((prev) => [...prev, `${file.name}: upload failed`]);
  }
}

  async function uploadUrl(e) {
  e.preventDefault();
  if (!urlInput.trim()) return;

  setUploading(true);
  try {
    const response = await apiClient.post("/api/v1/documents/upload-url", { url: urlInput });
    setMessages((prev) => [
      ...prev,
      `${urlInput}: uploaded, processing (document_id: ${response.data.document_id})`,
    ]);
    onUploadComplete();
    setUrlInput("");
  } catch (err) {
    const message = err.response?.data?.detail || "upload failed";
    setMessages((prev) => [...prev, `${urlInput}: ${message}`]);
  }
  setUploading(false);
}

  async function handleFiles(fileList) {
    setUploading(true);
    const files = Array.from(fileList);
    for (const file of files) {
      await uploadFile(file);
    }
    setUploading(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleFileInput(e) {
    handleFiles(e.target.files);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "2px dashed #4a9eff" : "2px dashed #666",
          padding: "40px",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <p>Drag and drop files here, or</p>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
        />
      </div>
      <form onSubmit={uploadUrl} style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
  <input
    type="url"
    placeholder="Or paste a URL to add a webpage"
    value={urlInput}
    onChange={(e) => setUrlInput(e.target.value)}
    style={{ flex: 1 }}
  />
  <button type="submit" disabled={uploading}>Add</button>
</form>
      {uploading && <p>Uploading...</p>}

      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default FileUpload;