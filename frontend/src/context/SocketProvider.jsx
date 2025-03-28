import { createContext, useContext, useEffect} from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    withCredentials: true,
    autoConnect: false,
});

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    useEffect(() => {
        socket.connect();

        return ()=> {
            socket.disconnect();
        }
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);