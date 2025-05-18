import React, { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { EVENTS } from "../constants/events";
import { FileText, Plus } from "lucide-react";

const extensionMap = {
  js: "javascript",
  jsx: "javascript",
  ts: "javascript",
  tsx: "javascript",
  py: "python",
  java: "java",
  c: "cpp", 
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  h: "cpp",
  hpp: "cpp",
  sh: "shell",
  bash: "shell",
  rs: "rust",
  pl: "perl",
  pm: "perl",
  go: "go",
  swift: "swift",
  kt: "kotlin",
  kts: "kotlin",
  rb: "ruby",
  lua: "lua",
  r: "r",
  php: "php",
  sql: "sql",
  html: "html",
  htm: "html",
  css: "css",
  md: "markdown",
  markdown: "markdown",
  json: "json",
};

const FilePanel = ({ roomId, username, files, setFiles, activeFile, setActiveFile }) => {
  const { socket } = useSocket();
  const [newFileName, setNewFileName] = useState("");

  const handleFileClick = (file) => {
    setActiveFile(file);
  };

  const handleAddFile = () => {
    if(files.length===10) {
      window.alert("Max Files Reached!");
      return;
    }
    if (!newFileName.trim()) return;
    if (files.some(file => file.name + "." + file.extension === newFileName)) {
      window.alert("File already exists!");
      return;
    }

    const splits = newFileName.split(".");
    const name = splits.length === 1 ? newFileName : newFileName.substring(0, newFileName.lastIndexOf("."));
    const ext = splits.length === 1 ? "js" : splits.pop();
    const lang = extensionMap[ext] || "javascript";

    const newFile = {
      name,
      content: "",
      language: lang,
      extension: ext,
    };

    setFiles((prev) => [...prev, newFile]);
    if (socket && roomId) {
      socket.emit(EVENTS.FILE.NEW_FILE, { roomId, file: newFile });
    }
    setNewFileName("");
  };

  return (
    <div className="h-full flex flex-col w-full p-4 shadow-sm bg-gray-800 rounded-lg">
      <h1 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="text-blue-500" size={20} /> Files Panel
      </h1>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="e.g. main.js"
          className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddFile}
          className="px-2 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {files.map((file, idx) => (
          <button
            key={idx}
            onClick={() => handleFileClick(file)}
            className={file.name===activeFile.name && file.extension=== activeFile.extension ? "flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm bg-gradient-to-tr from-blue-900 via-blue-800 to-blue-700": "flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm bg-gray-900 hover:bg-gradient-to-tr hover:from-blue-900 hover:via-blue-800 hover:to-blue-700 transition-all duration-150"}
          >
            <FileText size={16} className="text-green-500" />
            {file.name}.{file.extension}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilePanel;
