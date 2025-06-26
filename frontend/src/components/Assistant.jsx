import React, { useState } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Sparkles } from "lucide-react";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Assistant = ({ handleCodeChange, language, currentExtension, selectedTheme, themes }) => {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const modifiedPrompt = `Prompt: ${prompt}\n\n{If the above prompt specifies a language, generate code in the specified language. If it doesn't, generate code in ${language}. Do not include markdown or triple backticks.}`;
    setLoading(true);
    try {
      const res = await axios.post(`${VITE_BACKEND_URL}/api/ai/generate/`, { prompt: modifiedPrompt });
      setCode(res.data.code);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToEditor = () => {
    handleCodeChange(code);
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col w-full shadow-sm bg-gray-800 rounded-lg">

      <h1 className="text-xl font-semibold mb-4 flex items-center gap-2 z-10">
        <Sparkles className="text-blue-500" size={20} /> AI Assistant
      </h1>

      {/* Prompt Input */}
      <textarea
        placeholder="Ask the assistant"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 border rounded text-sm"
        rows={4}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`px-4 py-2 bg-gradient-to-tr from-blue-900 via-blue-800 to-blue-700 text-white border border-gray-600 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all duration-150 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Generating..." : "Generate Code"}
      </button>

      {/* Code Preview */}
      {code && (
        <>
          <div className="border rounded">
            <CodeMirror
              value={code}
              height="300px"
              theme={themes[selectedTheme] || vscodeDark}
              extensions={[currentExtension]}
              editable={false}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
              }}
              style={{
                fontSize: "16px",
                borderRadius: "4px",
              }}
            />
          </div>

          <button
            onClick={handleMoveToEditor}
            className="px-4 py-2 bg-gradient-to-tr from-blue-900 via-blue-800 to-blue-700 text-white border border-gray-600 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all duration-150"
          >
            Move to Editor
          </button>
        </>
      )}
    </div>
  );
};

export default Assistant;
