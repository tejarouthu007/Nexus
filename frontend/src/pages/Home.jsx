import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const Home = () => {
  const { socket, roomId, setRoomId, username, setUsername, isConnected } = useSocket();
  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();
    
    if (username.trim() && roomId.trim()) {
      navigate(`/editor`);
    }
  };

  const generateRoomId = () => {
    const newRoomId = crypto.randomUUID(); 
    setRoomId(newRoomId);
    localStorage.setItem("roomId", newRoomId);
  };

  useEffect(() => {
    const hasCleared = localStorage.getItem("localStorageCleared");
    if (!hasCleared) {
      localStorage.clear("roomId");
      localStorage.clear("username");
      localStorage.setItem("localStorageCleared", true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-500 to-green-400 rounded-full flex items-center justify-center text-2xl font-bold">
            NX
          </div>
        </div>
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
          Nexus Code Editor
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Collaborate in real-time with powerful language support, chat, and instant execution.
        </p>
      </div>

      {/* Join Room Form */}
      <form
        onSubmit={joinRoom}
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Join a Room</h2>

        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            localStorage.setItem("username", e.target.value);
          }}
          required
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
              localStorage.setItem("roomId", e.target.value);
            }}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={generateRoomId}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold transition duration-300"
          >
            Generate
          </button>
        </div>

        <button
          type="submit"
          disabled={!isConnected}
          className={`w-full py-3 rounded-md font-semibold transition duration-300 flex items-center justify-center gap-2 ${
            isConnected ? "bg-green-600 hover:bg-green-500" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          {!isConnected ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Connecting to the server...
            </>
          ) : (
            "Join Room"
          )}
        </button>

      </form>
    </div>
  );
};

export default Home;
