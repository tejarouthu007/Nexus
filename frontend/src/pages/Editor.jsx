import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import CodeEditor from "../components/CodeEditor";

const MainLayout = () => {
  const [files, setFiles] = useState([
    { name: "index.js", content: "// Write your JS code here" },
    { name: "style.css", content: "/* Your CSS here */" },
  ]);

  const [activeFile, setActiveFile] = useState(files[0]);

  const openFile = (file) => {
    if (!files.find((f) => f.name === file.name)) {
      setFiles([...files, file]);
    }
    setActiveFile(file);
  };

  const closeFile = (fileName) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    if (activeFile.name === fileName) {
      setActiveFile(updatedFiles.length > 0 ? updatedFiles[0] : null);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar files={files} openFile={openFile} />
      <CodeEditor files={files} activeFile={activeFile} setActiveFile={setActiveFile} closeFile={closeFile} />
    </div>
  );
};

export default MainLayout;
