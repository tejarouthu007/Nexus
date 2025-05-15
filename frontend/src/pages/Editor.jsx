import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

import { FileText, Play, MessageSquare, User, Code2Icon, LogOut, Info} from "lucide-react";
import { EVENTS } from "../constants/events";
import Chat from "../components/Chat";
import RunCode from "../components/RunCode";
import UserList from "../components/UserList";
import createRemoteCursorPlugin from "../components/Cursor.js"

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
  html,
  css,
  markdown,
};

const languageOptions = Object.keys(languageMap);


const Editor = () => {
  const { socket, roomId, username } = useSocket(); 
  const editorRef = useRef(null);
  const timeoutRef = useRef(null); 
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState(null);
  const [userCursors, setUserCursors] = useState(new Map());

  useEffect(() => {
    if(!socket) {
      navigate('/');
    }
    if (socket.emit && roomId && username) {
      socket.emit(EVENTS.ROOM.JOIN, { roomId: roomId, username: username });

      return () => {
        socket.emit(EVENTS.ROOM.LEAVE, { roomId: roomId, username: username });
      };
    }
  }, [socket, roomId, username]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  
    const view = editorRef.current?.view;
    if (!view) return;
  
    const pos = view.state.selection.main.head;
    const line = view.state.doc.lineAt(pos);
    const col = pos - line.from;
  
    const cursorPos = { line: line.number - 1, col };
  
    if (socket && roomId) {
      socket.emit(EVENTS.CODE.CHANGE, { roomId: roomId, code: newCode });
      socket.emit(EVENTS.CODE.CURSOR_MOVE, {
        roomId: roomId,
        username: username,
        cursor: cursorPos,
      });
    }
  };

  const handleLanguageChange = ( language ) => {
    setLanguage(language);
    if (socket && roomId) {
      socket.emit(EVENTS.CODE.LANG_CHANGE, { roomId: roomId, language });
    }
  };

  const handleLeaveRoom = () => {
    if (socket?.emit && roomId && username) {
      socket.emit(EVENTS.ROOM.LEAVE, { roomId: roomId, username: username });
      localStorage.clear('localStorageCleared')
      navigate('/');
    }
  }

  const getCursors = () => {
    return userCursors;
  }
  
  const remoteCursorExtension = useMemo(() => createRemoteCursorPlugin(getCursors), [userCursors]);

  useEffect(() => {
    if (!socket) return;
  
    const clearCursorTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); 
      }
    };
  
    socket.on(EVENTS.CODE.UPDATE, ({ code }) => {
      setCode(code);
      clearCursorTimeout();
    });
  
    socket.on(EVENTS.CODE.SYNC, ({ code, language }) => {
      setCode(code);
      setLanguage(language);
      clearCursorTimeout();
    });
  
    socket.on(EVENTS.CODE.CURSOR_UPDATE, ({ username, cursor }) => {
      setUserCursors((prev) => {
        const newMap = new Map(prev);
        newMap.set(username, cursor);
  
        clearCursorTimeout();
        
        timeoutRef.current = setTimeout(() => {
          setUserCursors((prev) => {
            const newMap = new Map(prev);
            newMap.delete(username);
            return newMap;
          });
        }, 800); // Reset timeout
  
        return newMap;
      });
    });

    socket.on(EVENTS.CODE.LANG_UPDATE, ({ language }) => {
      setLanguage(language);
    })
  
    return () => {
      socket.off(EVENTS.CODE.UPDATE);
      socket.off(EVENTS.CODE.LANG_UPDATE);
      socket.off(EVENTS.CODE.CURSOR_UPDATE);
      clearCursorTimeout(); 
    };
  }, [socket]);
  

  const currentExtension = useMemo(() => {
    const lang = languageMap[language];
    return typeof lang === "function" ? lang() : lang;
  }, [language]);
  

  return (
    <div className="flex h-screen min-h-screen"> 
      {/* Sidebar */}
      <div className="flex h-full">
        <div className="w-16 h-full bg-gray-800 flex flex-col items-center py-4 space-y-6">
          <button onClick={() => setActiveTab(activeTab === "files" ? null : "files")}>
            <FileText className="text-gray-300 hover:text-green-500" size={24} />
          </button>
          <button onClick={() => setActiveTab(activeTab === "run" ? null : "run")}>
            <Play className="text-gray-300 hover:text-green-500" size={24} />
          </button>
          <button onClick={() => setActiveTab(activeTab === "chat" ? null : "chat")}>
            <MessageSquare className="text-gray-300 hover:text-green-500" size={24} />
          </button>
          <button onClick={() => setActiveTab(activeTab === "users" ? null : "users")}>
            <User className="text-gray-300 hover:text-green-500" size={24} />
          </button>
          <div className="relative inline-block group">
            <button className="focus:outline-none z-10 relative">
              <Info
                className="text-gray-300 hover:text-white"
                size={24}
              />
            </button>

            <div className="absolute left-[80%] top-1/2 -translate-y-1/2 hidden group-hover:flex group-hover:opacity-100 bg-black text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-auto">
              Room ID: <span className="text-green-400 font-semibold ml-1">{roomId}</span>
            </div>
          </div>
          <button onClick={handleLeaveRoom}>
            <LogOut className="text-gray-300 hover:text-red-500 transform -scale-x-100" size={24} />
          </button>
        </div>

        {/* Sidebar Content */}
        {activeTab && (
          <div className="w-80 bg-gray-900 h-full p-4 text-gray-300 overflow-auto">
            {activeTab === "files" && <div>Files Panel</div>}
            {activeTab === "run" && <RunCode code={code} language={language} />}
            {activeTab === "chat" && <Chat roomId={roomId} username={username} />}
            {activeTab === "users" && <UserList roomId={roomId}/>}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="flex-1 h-full flex flex-col bg-gray-900">
        <div className="flex justify-between items-center bg-gray-800 p-3 text-white gap-4 rounded-l">
          <div className="flex items-center flex-row gap-2 items-center">
            <Code2Icon size={28}/>
            <span className="text-green-500 font-bold text-xl tracking-tight bg-gradient-to-tr text-transparent bg-clip-text from-green-500 via-green-400 to-blue-400">Nexus Code Editor</span>
          </div>

          <div className="flex gap-3 items-center">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
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
              <div className="absolute top-0.5 left-9 text-gray-500 font-mono pointer-events-none select-none z-10">
                Start typing your code here...
              </div>
            )}
            <CodeMirror
              ref={editorRef}
              value={code}
              extensions={[currentExtension, remoteCursorExtension]}
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
