import { createContext, useContext, useState, useRef } from "react";
import { io } from "socket.io-client";
import { EVENTS } from "../constants/events";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false); // initial state

  const connectSocket = ({ roomId, username }) => {

    const socket = io(VITE_BACKEND_URL, {
      withCredentials: true,
      autoConnect: true,
      query: { roomId },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket");
    });

    socket.on(EVENTS.CHAT.NEW_MESSAGE, ({ username, message }) => {
      setMessages((prev) => [...prev, { user: username, message }]);
    });
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connectSocket, messages, setMessages, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
