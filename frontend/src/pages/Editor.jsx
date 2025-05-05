import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import CodeMirror from "@uiw/react-codemirror";

// Themes
import { oneDark } from "@codemirror/theme-one-dark";

// Language extensions
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { php } from "@codemirror/lang-php";
import { StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { rust } from '@codemirror/legacy-modes/mode/rust';
import { perl } from '@codemirror/legacy-modes/mode/perl';
import { go } from '@codemirror/legacy-modes/mode/go';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { kotlin } from '@codemirror/legacy-modes/mode/clike';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { lua } from '@codemirror/legacy-modes/mode/lua';
import { r } from '@codemirror/legacy-modes/mode/r';
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";

import { FileText, Play, MessageSquare, User, Code2Icon } from "lucide-react";
import { EVENTS } from "../constants/events";
import Chat from "../components/Chat";
import RunCode from "../components/RunCode";
import UserList from "../components/UserList";

const languageMap = {
  javascript,
  python,
  java,
  cpp,
  shell: () => StreamLanguage.define(shell),
  rust: () => StreamLanguage.define(rust),
  perl: () => StreamLanguage.define(perl),
  go: () => StreamLanguage.define(go),
  swift: () => StreamLanguage.define(swift),
  kotlin: () => StreamLanguage.define(kotlin),
  ruby: () => StreamLanguage.define(ruby),
  lua: () => StreamLanguage.define(lua),
  r: () => StreamLanguage.define(r),
  php,
  sql,
};

const languageOptions = Object.keys(languageMap);

const Editor = () => {
  const { state } = useLocation();
  const socket = useSocket().socket;

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (socket?.emit && state?.roomId && state.username) {
      socket.emit(EVENTS.ROOM.JOIN, { roomId: state.roomId, username: state.username });

      return () => {
        socket.emit(EVENTS.ROOM.LEAVE, { roomId: state.roomId, username: state.username });
      };
    }
  }, [socket, state?.roomId, state?.username]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket && state?.roomId) {
      socket.emit(EVENTS.CODE.CHANGE, { roomId: state.roomId, code: newCode });
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(EVENTS.CODE.UPDATE, ({ code }) => setCode(code));
    socket.on(EVENTS.CODE.SYNC, ({ code }) => setCode(code));

    return () => {
      socket.off(EVENTS.CODE.UPDATE);
    };
  }, [socket]);

  const currentExtension = useMemo(() => languageMap[language](), [language]);

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
          <button onClick={() => setActiveTab(activeTab === "users" ? null : "users")}>
            <User className="text-gray-300 hover:text-white" size={24} />
          </button>
        </div>

        {/* Sidebar Content */}
        {activeTab && (
          <div className="w-80 bg-gray-900 h-full p-4 text-gray-300 overflow-auto">
            {activeTab === "files" && <div>Files Panel</div>}
            {activeTab === "run" && <RunCode code={code} language={language} />}
            {activeTab === "chat" && <Chat roomId={state.roomId} username={state.username} />}
            {activeTab === "users" && <UserList roomId={state.roomId}/>}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="flex-1 h-full flex flex-col bg-gray-900">
        <div className="flex justify-between items-center bg-gray-800 p-3 text-white gap-4 rounded-l">
          <div className="flex items-center flex-row gap-2">
            <Code2Icon size={28}/>
            <span className="font-bold text-lg"> Live Code Editor</span>
          </div>
          <div className="flex gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border-2 bg-gray-700 text-white rounded px-2 py-1"
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 relative overflow-auto bg-[#282c34] rounded-l"> 
          <div className="absolute inset-0"> 
            {/* Placeholder */}
            {code === "" && (
              <div className="absolute top-0.5 left-9 text-gray-500 pointer-events-none select-none z-10">
                Start typing your code here...
              </div>
            )}
            <CodeMirror
              value={code}
              extensions={[currentExtension]}
              theme={oneDark}
              onChange={handleCodeChange}
              className="w-full" 
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
              }}
              style={{
                height: "100%",       
                overflow: "auto",
                fontSize: "16px"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
