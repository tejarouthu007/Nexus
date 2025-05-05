import React, { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { EVENTS } from "../constants/events";
import { User, MessageSquare } from "lucide-react";

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
      <div className="p-2 overflow-auto flex-grow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-3 mb-2 flex gap-3 items-start rounded-lg border border-gray-200 bg-blue shadow-sm"
          >
            <div className="flex flex-col items-center gap-2 pt-1">
              <User size={18} className="text-green-500" />
              <MessageSquare size={18} className="text-blue-500" />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">{msg.user}</p>
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>


      {/* Input and Send button at bottom */}
      <div className="mt-2 flex">
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
