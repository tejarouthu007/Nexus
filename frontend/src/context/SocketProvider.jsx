import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { EVENTS } from "../constants/events";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,
});

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

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
    <SocketContext.Provider value={{ socket, messages, setMessages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
