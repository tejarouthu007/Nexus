import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
 
const Home = () => {
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();
  
    const joinRoom = () => {
      if (userName.trim() && roomId.trim()) {
        navigate(`/editor/${roomId}`, { state: { userName } });
      }
    };
  
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl mb-4">Join a Room</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="p-2 mb-3 rounded bg-gray-800 border border-gray-600 w-64"
        />
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="p-2 mb-3 rounded bg-gray-800 border border-gray-600 w-64"
        />
        <button
          onClick={joinRoom}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Join Room
        </button>
      </div>
    );
};

export default Home;
