import React, { useState } from "react";

const RunCode = ({ code, language }) => {
  const [output, setOutput] = useState("Run to view output");

  const runCode = () => {
    const logs = [];
    const originalLog = console.log;

    try {
      // Intercept console.log
      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      // Run the code in a new function scope
      const result = new Function(code)();
      if (result !== undefined) {
        logs.push(String(result));
      }

      setOutput(logs.join("\n") || "Code ran successfully.");
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      // Restore console.log
      console.log = originalLog;
    }
  };

  return (
    <div>
      <button
        onClick={runCode}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Run JavaScript
      </button>
      <div className="bg-gray-800 p-2 rounded text-sm text-green-400 whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
};

export default RunCode;
