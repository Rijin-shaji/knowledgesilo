import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import DocumentList from "../components/DocumentList";
import ChatInterface from "../components/ChatInterface";
import UsageStats from "../components/UsageStats";
import ApiKeyGenerator from "../components/ApiKeyGenerator";
import logo from "../assets/logo.png";
import "./Dashboard.css";

function Dashboard() {
  const tenantName = localStorage.getItem("tenantName");
  const [selectedIds, setSelectedIds] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeView, setActiveView] = useState("chat");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("tenantName");
    navigate("/login");
  }

  const navItems = [
    { id: "chat", label: "Chat" },
    { id: "documents", label: "Documents" },
    { id: "usage", label: "Usage" },
    { id: "api-keys", label: "API Keys" },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="DocuVault AI" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-tenant-name">{tenantName}</p>
          <button className="btn-ghost sidebar-logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {activeView === "chat" && (
  <ChatInterface
    documentIds={selectedIds}
    onDocumentAdded={() => setRefreshKey((prev) => prev + 1)}
  />
)}

        {activeView === "documents" && (
          <div className="dashboard-view">
            <h2>Documents</h2>
            <FileUpload onUploadComplete={() => setRefreshKey((prev) => prev + 1)} />
            <DocumentList
              key={refreshKey}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </div>
        )}

        {activeView === "usage" && (
          <div className="dashboard-view">
            <h2>Usage</h2>
            <UsageStats />
          </div>
        )}

        {activeView === "api-keys" && (
          <div className="dashboard-view">
            <h2>API Keys</h2>
            <ApiKeyGenerator />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;