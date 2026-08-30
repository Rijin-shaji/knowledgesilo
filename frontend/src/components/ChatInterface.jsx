import { useState } from "react";

function ChatInterface({ documentIds }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    const assistantMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuestion("");
    setIsStreaming(true);

    const apiKey = localStorage.getItem("apiKey");

    const response = await fetch("http://127.0.0.1:8000/api/v1/query/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
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

  return (
    <div>
      <div style={{ minHeight: "200px", marginBottom: "16px" }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.role === "user" ? "You" : "KnowledgeSilo"}:</strong> {msg.content}
          </p>
        ))}
      </div>

      <form onSubmit={handleAsk}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your documents..."
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming}>
          {isStreaming ? "Thinking..." : "Ask"}
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;