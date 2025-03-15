import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@uiw/react-codemirror";
import { X } from "lucide-react";

const CodeEditor = ({ files, activeFile, setActiveFile, closeFile }) => {
  return (
    <div className="flex-1 h-full flex flex-col bg-gray-900">
      {/* File Tabs */}
      <div className="flex bg-gray-800 text-gray-300 p-2 space-x-2">
        {files.map((file) => (
          <div
            key={file.name}
            className={`flex items-center px-3 py-1 rounded-t-md cursor-pointer ${
              file.name === activeFile.name ? "bg-gray-700 text-white" : ""
            }`}
            onClick={() => setActiveFile(file)}
          >
            {file.name}
            <X
              size={16}
              className="ml-2 text-gray-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.name);
              }}
            />
          </div>
        ))}
      </div>

      {/* Code Editor */}
      <div className="flex-1">
        {activeFile ? (
          <CodeMirror
            value={activeFile.content}
            extensions={[javascript()]}
            theme={oneDark}
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No file opened
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
