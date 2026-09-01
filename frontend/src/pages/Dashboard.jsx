import { useState } from "react";
import FileUpload from "../components/FileUpload";
import DocumentList from "../components/DocumentList";
import ChatInterface from "../components/ChatInterface";
import UsageStats from "../components/UsageStats";
import ApiKeyGenerator from "../components/ApiKeyGenerator";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const tenantName = localStorage.getItem("tenantName");
  const [selectedIds, setSelectedIds] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("tenantName");
    navigate("/login");
  }
  return (
    <div>
      <h1>Welcome, {tenantName}</h1>
      <ApiKeyGenerator />
      <hr />
      <UsageStats />
      <hr />
      <FileUpload onUploadComplete={() => setRefreshKey((prev) => prev + 1)} />
      <hr />
      <button onClick={handleLogout}>Log Out</button>
      <DocumentList
        key={refreshKey}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      <hr />
      <ChatInterface documentIds={selectedIds} />
    </div>
  );
}

export default Dashboard;