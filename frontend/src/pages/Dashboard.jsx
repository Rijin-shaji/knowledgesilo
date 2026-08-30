import { useState } from "react";
import FileUpload from "../components/FileUpload";
import DocumentList from "../components/DocumentList";
import ChatInterface from "../components/ChatInterface";
import UsageStats from "../components/UsageStats";

function Dashboard() {
  const tenantName = localStorage.getItem("tenantName");
  const [selectedIds, setSelectedIds] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <h1>Welcome, {tenantName}</h1>
      <UsageStats />
      <hr />
      <FileUpload onUploadComplete={() => setRefreshKey((prev) => prev + 1)} />
      <hr />
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