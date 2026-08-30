import { useState, useEffect } from "react";
import apiClient from "../api/client";

function DocumentList({ selectedIds, onSelectionChange }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/v1/documents/");
      setDocuments(response.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
    setLoading(false);
  }

  function toggleSelection(documentId) {
    if (selectedIds.includes(documentId)) {
      onSelectionChange(selectedIds.filter((id) => id !== documentId));
    } else {
      onSelectionChange([...selectedIds, documentId]);
    }
  }

  async function handleDelete(documentId) {
  try {
    await apiClient.delete(`/api/v1/documents/${documentId}`);
    setDocuments((prev) => prev.filter((doc) => doc.document_id !== documentId));
    onSelectionChange(selectedIds.filter((id) => id !== documentId));
  } catch (err) {
    console.error("Failed to delete document", err);
  }
}

  if (loading) return <p>Loading documents...</p>;

  return (
    <div>
      <h3>Your Documents</h3>
      {documents.length === 0 && <p>No documents uploaded yet.</p>}
      <ul>
        {documents.map((doc) => (
         <li key={doc.document_id}>
          <label>
            <input
              type="checkbox"
              checked={selectedIds.includes(doc.document_id)}
              onChange={() => toggleSelection(doc.document_id)}
            />
            {doc.filename}
          </label>
          <button onClick={() => handleDelete(doc.document_id)}>Delete</button>
         </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentList;