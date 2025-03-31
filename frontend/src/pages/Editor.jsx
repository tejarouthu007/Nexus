import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@uiw/react-codemirror";
import { FileText, Play, MessageSquare } from "lucide-react";
import { EVENTS } from "../constants/events";
import Chat from "../components/Chat";

const MainLayout = () => {
  const { state } = useLocation();
  const socket = useSocket();
  
  const [code, setCode] = useState("// Start coding here...");
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (socket && state?.roomId && state.username) {
      socket.emit(EVENTS.ROOM.JOIN, { roomId: state.roomId, username: state.username });

      return () => {
        socket.emit(EVENTS.ROOM.LEAVE, { roomId: state.roomId, username: state.username });
      };
    }
  }, []);

  // Emit code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket && state?.roomId) {
      console.log(newCode);
      socket.emit(EVENTS.CODE.CHANGE, { roomId: state.roomId, code: newCode });
    }
  };

  // Listen for code updates from others
  useEffect(() => {
    if (!socket) return;

    socket.on(EVENTS.CODE.UPDATE, ({ code }) => {
      setCode(code);
    });

    return () => {
      socket.off(EVENTS.CODE.UPDATE);
    };
  }, [socket]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex h-full">
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

        {/* Sidebar Content */}
        {activeTab && (
          <div className="w-64 bg-gray-900 h-full p-4 text-gray-300">
            {activeTab === "files" && <div>Files Panel</div>}
            {activeTab === "run" && <div>Run Code</div>}
            {activeTab === "chat" && <Chat roomId={state.roomId} username={state.username}/>}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="flex-1 h-full flex flex-col bg-gray-900">
        <div className="text-white bg-gray-800 p-3 text-lg">Live Code Editor</div>
        <div className="flex-1">
          <CodeMirror
            value={code}
            extensions={[javascript()]}
            theme={oneDark}
            className="w-full h-full"
            onChange={handleCodeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
