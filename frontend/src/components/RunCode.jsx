import React, { useState } from "react";

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
          version: "*", // use latest version
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
    <div>
      <button
        onClick={runCode}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Run Code
      </button>
      <div className="bg-gray-800 p-2 rounded text-sm font-bold text-green-400 whitespace-pre-wrap overflow-auto">
        {output}
      </div>
    </div>
  );
};

export default RunCode;
