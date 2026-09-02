import { useState } from "react";
import "./ChatInterface.css";
import apiClient from "../api/client";

function ChatInterface({ documentIds, onDocumentAdded }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    const assistantMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuestion("");
    setIsStreaming(true);

    const authToken = localStorage.getItem("authToken");
    const apiKey = localStorage.getItem("apiKey");

    const headers = { "Content-Type": "application/json" };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch("http://127.0.0.1:8000/api/v1/query/stream", {
      method: "POST",
      headers,
      body: JSON.stringify({
        question: userMessage.content,
        document_ids: documentIds.length > 0 ? documentIds : null,
      }),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") continue;

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          const updatedLast = { ...last, content: last.content + data };
          return [...prev.slice(0, -1), updatedLast];
        });
      }
    }

    setIsStreaming(false);
  }

  async function handleAttach(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const systemMessage = { role: "system", content: `Uploading ${file.name}...` };
    setMessages((prev) => [...prev, systemMessage]);

    try {
      await apiClient.post("/api/v1/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "system", content: `${file.name} uploaded and processing.` },
      ]);
      onDocumentAdded();
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "system", content: `Failed to upload ${file.name}.` },
      ]);
    }

    e.target.value = "";
  }

  async function handleAttachUrl(e) {
  e.preventDefault();
  if (!urlValue.trim()) return;

  const systemMessage = { role: "system", content: `Adding ${urlValue}...` };
  setMessages((prev) => [...prev, systemMessage]);
  setShowUrlInput(false);
  const submittedUrl = urlValue;
  setUrlValue("");

  try {
    await apiClient.post("/api/v1/documents/upload-url", { url: submittedUrl });
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "system", content: `${submittedUrl} added and processing.` },
    ]);
    onDocumentAdded();
  } catch (err) {
    const message = err.response?.data?.detail || "Failed to add that URL.";
    setMessages((prev) => [...prev.slice(0, -1), { role: "system", content: message }]);
  }
}

    return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty-state">
            <h2>Ask your documents anything</h2>
            <p>Select a document, or search across all of them.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${
              msg.role === "user"
                ? "chat-message-user"
                : msg.role === "system"
                ? "chat-message-system"
                : "chat-message-ai"
            }`}
          >
            {msg.role !== "system" && (
              <span className="chat-message-label">
                {msg.role === "user" ? "You" : "DocuVault AI"}
              </span>
            )}
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      {showUrlInput && (
        <form onSubmit={handleAttachUrl} className="chat-url-form">
          <input
            type="url"
            placeholder="Paste a webpage URL..."
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            autoFocus
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setShowUrlInput(false)}>
            Cancel
          </button>
        </form>
      )}

      <form onSubmit={handleAsk} className="chat-input-form">
        <div className="chat-attach-wrapper">
          <button
            type="button"
            className="chat-attach-btn"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
          >
            📎
          </button>

          {showAttachMenu && (
            <div className="chat-attach-menu">
              <label className="chat-attach-option">
                Upload a file
                <input
                  type="file"
                  onChange={(e) => {
                    handleAttach(e);
                    setShowAttachMenu(false);
                  }}
                  style={{ display: "none" }}
                  accept=".pdf,.docx,.txt"
                />
              </label>
              <button
                type="button"
                className="chat-attach-option"
                onClick={() => {
                  setShowUrlInput(true);
                  setShowAttachMenu(false);
                }}
              >
                Add from URL
              </button>
            </div>
          )}
        </div>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about your documents..."
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming}>
          {isStreaming ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;