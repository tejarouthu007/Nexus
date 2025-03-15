import React, { useState } from "react";
import { FileText, Play, MessageSquare } from "lucide-react";

const Sidebar = ({ files, openFile }) => {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div className="flex h-full">
      {/* Sidebar Icons */}
      <div className="w-16 h-full bg-gray-800 flex flex-col items-center py-4 space-y-6">
        <button onClick={() => setActiveTab(activeTab === "files" ? null : "files")}>
          <FileText className="text-gray-300 hover:text-white" size={24} />
        </button>
        <button onClick={() => setActiveTab(activeTab === "run" ? null : "run")}>
          <Play className="text-gray-300 hover:text-white" size={24} />
        </button>
        <button onClick={() => setActiveTab(activeTab === "chat" ? null : "chat")}>
          <MessageSquare className="text-gray-300 hover:text-white" size={24} />
        </button>
      </div>

      {activeTab && (
        <div className="w-64 bg-gray-900 h-full p-4 text-gray-300">
          {activeTab === "files" && (
            <div>
              <h3 className="text-white mb-2">Files</h3>
              {files.map((file) => (
                <div
                  key={file.name}
                  className="p-2 cursor-pointer hover:bg-gray-700"
                  onClick={() => openFile(file)}
                >
                  {file.name}
                </div>
              ))}
            </div>
          )}
          {activeTab === "run" && <div>Run Code</div>}
          {activeTab === "chat" && <div>User Chat</div>}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
