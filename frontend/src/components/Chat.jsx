import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { EVENTS } from "../constants/events";

const Chat = ({ roomId, username }) => {
  const [newMessage, setMessage] = useState(""); 
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    const handleNewMessage = ({ username, message }) => {
      setMessages((prevMessages) => [...prevMessages, { user: username, message }]);
    };

    socket.on(EVENTS.CHAT.NEW_MESSAGE, handleNewMessage);

    return () => socket.off(EVENTS.CHAT.NEW_MESSAGE, handleNewMessage); 
  }, [socket]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    console.log(roomId+"  "+username);
    // Send message via socket
    socket.emit(EVENTS.CHAT.SEND_MESSAGE, { roomId, username, message: newMessage });

    setMessage("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Chat</h1>

      <div className="border p-2 h-96 overflow-auto">
        {messages.map((msg, index) => (
          <p key={index} className=" p-2 rounded my-1">
            <strong>{msg.user}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <div className="fixed bottom-0 p-2 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleSend} 
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
