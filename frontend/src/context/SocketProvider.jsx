import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { EVENTS } from "../constants/events";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(VITE_BACKEND_URL, {
  withCredentials: true,
  autoConnect: false,
});

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(() => localStorage.getItem("roomId") || null);
  const [username, setUsername] = useState(() => localStorage.getItem("username") || null);

  useEffect(() => {
    socket.connect();

    const handleNewMessage = ({ username, message }) => {
      setMessages((prev) => [...prev, { user: username, message }]);
    };
    
    socket.on(EVENTS.CHAT.NEW_MESSAGE, handleNewMessage);
    
    return () => {
      socket.off(EVENTS.CHAT.NEW_MESSAGE, handleNewMessage);
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, messages, setMessages, roomId, setRoomId, username, setUsername }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
