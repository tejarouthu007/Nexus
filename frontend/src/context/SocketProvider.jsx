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
  const [isConnected, setIsConnected] = useState(socket.connected); // initial state

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      setIsConnected(true);
      console.log("Socket connected with id:", socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    };

    const handleNewMessage = ({ username, message }) => {
      setMessages((prev) => [...prev, { user: username, message }]);
    };
    
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(EVENTS.CHAT.NEW_MESSAGE, handleNewMessage);
    
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(EVENTS.CHAT.NEW_MESSAGE, handleNewMessage);
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, messages, setMessages, roomId, setRoomId, username, setUsername, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
