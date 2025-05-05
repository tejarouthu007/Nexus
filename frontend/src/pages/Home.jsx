import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();
    if (username.trim() && roomId.trim()) {
      navigate(`/editor`, { state: { roomId, username } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center mb-10">
        {/* Logo placeholder */}
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-500 to-green-400 rounded-full flex items-center justify-center text-2xl font-bold">
            NX
          </div>
        </div>

        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Nexus Code Editor</h1>
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
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-md font-semibold transition duration-300"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default Home;
