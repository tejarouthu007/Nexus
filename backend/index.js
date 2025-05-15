import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { SOCKET_EVENTS } from "./events/events.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://nexus-editor-live.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 20000,
});

app.use(cors({
    origin: ["https://nexus-editor-live.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const roomUsersMap = new Map(); 
const codeMap = new Map();   
const langMap = new Map();  

// Handle socket connections
io.on(SOCKET_EVENTS.CONNECTION, (socket) => {

    // Authenticate
    socket.on(SOCKET_EVENTS.AUTHENTICATE, ({ username }) => {
        // Optional authentication logic
    });

    // Join Room
    socket.on(SOCKET_EVENTS.ROOM.JOIN, ({ roomId, username }) => {
        const user = { socketId: socket.id, username };

        if (!roomUsersMap.has(roomId)) {
            roomUsersMap.set(roomId, []);
        }

        roomUsersMap.get(roomId).push(user);
        socket.join(roomId);

        broadcastUsers(roomId);

        const currentCode = codeMap.get(roomId) || '';
        const currentLanguage = langMap.get(roomId) || 'javascript';
        socket.emit(SOCKET_EVENTS.CODE.SYNC, { code: currentCode, language: currentLanguage });
    });

    // Leave Room
    socket.on(SOCKET_EVENTS.ROOM.LEAVE, ({ roomId }) => {
        const users = roomUsersMap.get(roomId) || [];
        const updatedUsers = users.filter(u => u.socketId !== socket.id);

        if (updatedUsers.length === 0) {
            roomUsersMap.delete(roomId);
            codeMap.delete(roomId);
            langMap.delete(roomId);
        } else {
            roomUsersMap.set(roomId, updatedUsers);
            broadcastUsers(roomId);
        }

        socket.leave(roomId);
    });

    // Get users in a room
    socket.on(SOCKET_EVENTS.ROOM.GET_USERS, ({ roomId }) => {
        broadcastUsers(roomId);
    });

    // Code change
    socket.on(SOCKET_EVENTS.CODE.CHANGE, ({ roomId, code }) => {
        codeMap.set(roomId, code);
        socket.to(roomId).emit(SOCKET_EVENTS.CODE.UPDATE, { code });
    });

    // Cursor movement
    socket.on(SOCKET_EVENTS.CODE.CURSOR_MOVE, ({ roomId, username, cursor }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CODE.CURSOR_UPDATE, { username, cursor });
    });

    // Language change
    socket.on(SOCKET_EVENTS.CODE.LANG_CHANGE, ({ roomId, language }) => {
        langMap.set(roomId, language);
        socket.to(roomId).emit(SOCKET_EVENTS.CODE.LANG_UPDATE, { language });
    });

    // Chat messages
    socket.on(SOCKET_EVENTS.CHAT.SEND_MESSAGE, ({ roomId, username, message }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CHAT.NEW_MESSAGE, { username, message });
    });

    socket.on(SOCKET_EVENTS.CHAT.TYPING, ({ roomId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CHAT.TYPING, { username });
    });

    socket.on(SOCKET_EVENTS.CHAT.STOP_TYPING, ({ roomId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CHAT.STOP_TYPING, { username });
    });

    // Versioning (implement later)
    socket.on(SOCKET_EVENTS.VERSIONING.SAVE, ({ roomId, code }) => {
        // Save code version logic
    });

    socket.on(SOCKET_EVENTS.VERSIONING.LOAD_VERSION, ({ roomId, versionIndex }) => {
        // Load version logic
    });

    // Execute code (implement later)
    socket.on(SOCKET_EVENTS.EXECUTION.RUN, ({ roomId, code, language }) => {
        // executeCode(code, language, (output) => {
        //     io.to(roomId).emit(SOCKET_EVENTS.EXECUTION.RESULT, { output });
        // });
    });

    // Disconnect cleanup
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        removeUserFromAllRooms(socket.id);
    });
});

// Remove user from all rooms
function removeUserFromAllRooms(socketId) {
    for (const [roomId, users] of roomUsersMap.entries()) {
        const updatedUsers = users.filter(u => u.socketId !== socketId);
        if (updatedUsers.length === 0) {
            roomUsersMap.delete(roomId);
            codeMap.delete(roomId);
            langMap.delete(roomId);
        } else {
            roomUsersMap.set(roomId, updatedUsers);
            broadcastUsers(roomId);
        }
    }
}

// Broadcast user list to a room
function broadcastUsers(roomId) {
    const users = roomUsersMap.get(roomId) || [];
    io.to(roomId).emit(SOCKET_EVENTS.ROOM.USER_LIST, users);
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
