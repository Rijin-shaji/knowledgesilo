import { useState, useEffect } from "react";
import apiClient from "../api/client";
import "./DocumentList.css";

function DocumentList({ selectedIds, onSelectionChange }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState([]);

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

  function toggleDeleteTarget(documentId) {
    if (deleteTargets.includes(documentId)) {
      setDeleteTargets(deleteTargets.filter((id) => id !== documentId));
    } else {
      setDeleteTargets([...deleteTargets, documentId]);
    }
  }

  async function handleBulkDelete() {
    for (const id of deleteTargets) {
      try {
        await apiClient.delete(`/api/v1/documents/${id}`);
      } catch (err) {
        console.error(`Failed to delete ${id}`, err);
      }
    }
    setDocuments((prev) => prev.filter((doc) => !deleteTargets.includes(doc.document_id)));
    onSelectionChange(selectedIds.filter((id) => !deleteTargets.includes(id)));
    setDeleteTargets([]);
    setSelectMode(false);
  }

  function cancelSelectMode() {
    setSelectMode(false);
    setDeleteTargets([]);
  }

  if (loading) return <p>Loading documents...</p>;

  return (
    <div className="doc-list-container">
      <div className="doc-list-header">
        <h3>Your Documents</h3>
        {!selectMode ? (
          <button className="btn-primary" onClick={() => setSelectMode(true)}>
            Delete
          </button>
        ) : (
          <div className="doc-list-select-actions">
            <button className="btn-primary" onClick={cancelSelectMode}>
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={handleBulkDelete}
              disabled={deleteTargets.length === 0}
            >
              Delete Selected ({deleteTargets.length})
            </button>
          </div>
        )}
      </div>

      {documents.length === 0 && <p className="doc-list-empty">No documents uploaded yet.</p>}

      <ul className="doc-list">
        {documents.map((doc) => (
          <li key={doc.document_id} className="doc-list-item">
            <input
              type="checkbox"
              checked={
                selectMode
                  ? deleteTargets.includes(doc.document_id)
                  : selectedIds.includes(doc.document_id)
              }
              onChange={() =>
                selectMode
                  ? toggleDeleteTarget(doc.document_id)
                  : toggleSelection(doc.document_id)
              }
            />
            <span className="doc-list-filename">{doc.filename}</span>
          </li>
        ))}
      </ul>

      {!selectMode && (
        <p className="doc-list-hint">
          Check documents above to search within them, or leave unchecked to search all.
        </p>
      )}
    </div>
  );
}

export default DocumentList;