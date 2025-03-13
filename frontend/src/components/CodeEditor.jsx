import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@uiw/react-codemirror";

const CodeEditor = () => {
  const initialWidth = 500;
  const [left, setLeft] = useState(window.innerWidth - initialWidth);
  const minWidth = 300;
  const maxLeft = window.innerWidth - minWidth; 

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startLeft = left;

    const onMouseMove = (event) => {
      const delta = event.clientX - startX;
      let newLeft = startLeft + delta;
      newLeft = Math.min(newLeft, maxLeft);
      newLeft = Math.max(0, newLeft);
      setLeft(newLeft);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="relative h-screen w-screen bg-gray-900">
      <div
        className="absolute top-1/2 transform -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-lg"
        style={{ left, right: 0, height: 400 }}
      >
        {/* Left Drag Handle */}
        <div
          className="absolute top-0 left-0 h-full w-2 bg-gray-600 cursor-ew-resize"
          onMouseDown={handleMouseDown}
        />

        {/* CodeMirror Editor */}
        <div className="w-full h-full">
          <CodeMirror
            value="// Write your code here"
            extensions={[javascript()]}
            theme={oneDark}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
