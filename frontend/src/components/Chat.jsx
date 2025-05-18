import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketProvider";
import { EVENTS } from "../constants/events";
import { User, MessageSquare } from "lucide-react";

const Chat = ({ roomId, username }) => {
  const [newMessage, setMessage] = useState("");
  const { socket, messages, setMessages } = useSocket();
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    socket.emit(EVENTS.CHAT.SEND_MESSAGE, {
      roomId,
      username,
      message: newMessage,
    });

    setMessages((prev) => [...prev, { user: username, message: newMessage }]);
    setMessage("");
  };

  return (
    <div className="h-full flex flex-col w-full p-4 shadow-sm bg-gray-800 rounded-lg">
      <h1 className="text-xl font-semibold mb-4 flex items-center gap-2 z-10">
        <MessageSquare className="text-blue-500" size={20} /> Chat 
      </h1>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto mb-4 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-3 mb-3 flex gap-3 items-center rounded-md bg-gray-900 text-white"
          >
            <div className="flex flex-col items-center gap-2 pt-1">
              <User size={18} className="text-green-500" />
              <MessageSquare size={18} className="text-blue-500" />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">{msg.user}</p>
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Send */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-grow px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
