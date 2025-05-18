import React, { useState } from "react";
import { Play } from "lucide-react";

const RunCode = ({ code, language }) => {
  const [output, setOutput] = useState("Run to view output");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          version: "*",
          files: [
            {
              name: "main",
              content: code,
            },
          ],
        }),
      });

      const result = await response.json();

      if (result.run?.stderr) {
        setOutput(result.run.stderr);
      } else {
        setOutput(result.run?.output || "No output");
      }
    } catch (error) {
      setOutput("Error executing code");
      console.error("Execution error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4">
      <div className="mb-3">
        <button
          onClick={runCode}
          disabled={loading}
          className={`bg-blue-700 flex items-center gap-2 text-white px-5 py-2 rounded-md 
            hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 
            transition disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <Play
            size={18}
            className={`${loading ? "animate-pulse" : ""}`}
            aria-hidden="true"
          />
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>

      <div
        className="flex-1 bg-gray-900 font-semibold font-mono text-green-400 p-4 rounded-md text-sm overflow-auto whitespace-pre-wrap border border-gray-700 shadow-inner transition-colors duration-300"
        aria-live="polite"
      >
        {output}
      </div>
    </div>
  );
};

export default RunCode;
