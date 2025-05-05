import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import CodeMirror from "@uiw/react-codemirror";

// Themes
import { oneDark } from "@codemirror/theme-one-dark";

// Language extensions
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { php } from "@codemirror/lang-php";
import { css } from "@codemirror/lang-css";
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

import { FileText, Play, MessageSquare } from "lucide-react";
import { EVENTS } from "../constants/events";
import Chat from "../components/Chat";
import RunCode from "../components/RunCode";

const languageMap = {
  javascript,
  python,
  html,
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
  markdown,
  sql,
  css,
};


const languageOptions = Object.keys(languageMap); 

const Editor = () => {
  const { state } = useLocation();
  const socket = useSocket().socket;

  const [code, setCode] = useState("// Start coding here...");
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
        </div>

        {/* Sidebar Content */}
        {activeTab && (
          <div className="w-64 bg-gray-900 h-full p-4 text-gray-300">
            {activeTab === "files" && <div>Files Panel</div>}
            {activeTab === "run" && <RunCode code={code} language={language} />}
            {activeTab === "chat" && <Chat roomId={state.roomId} username={state.username} />}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="flex-1 h-full flex flex-col bg-gray-900">
        <div className="flex justify-between items-center bg-gray-800 p-3 text-white gap-4">
          <span className="text-lg">Live Code Editor</span>
          <div className="flex gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1"
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <CodeMirror
            value={code}
            extensions={[currentExtension]}
            theme={oneDark}
            className="w-full h-full"
            onChange={handleCodeChange}
            style={{ fontSize: "16px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
