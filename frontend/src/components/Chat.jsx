import React, { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { EVENTS } from "../constants/events";

const Chat = ({ roomId, username }) => {
  const [newMessage, setMessage] = useState("");
  const { socket, messages, setMessages } = useSocket();

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
    <div className="h-full flex flex-col w-full">
      <h1 className="text-xl font-bold mb-2">Chat</h1>

      {/* Scrollable chat messages */}
      <div className="border p-2 overflow-y-auto flex-grow">
        {messages.map((msg, index) => (
          <p key={index} className="p-2 rounded my-1">
            <strong>{msg.user}:</strong> {msg.message}
          </p>
        ))}
      </div>

      {/* Input and Send button at bottom */}
      <div className="mt-2 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
