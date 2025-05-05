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
        origin: "https://nexus-editor-live.vercel.app",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors({
    origin: "https://nexus-editor-live.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

let userSocketMap = [];
const codeMap = new Map();

// Handle socket connections
io.on(SOCKET_EVENTS.CONNECTION, (socket) => {

    // Authenticate user
    socket.on(SOCKET_EVENTS.AUTHENTICATE, ({ username }) => {
    });

    // Join Room
    socket.on(SOCKET_EVENTS.ROOM.JOIN, ({ roomId, username }) => {
        const user = { socketId: socket.id, username, roomId };
        userSocketMap.push(user);
        socket.join(roomId);

        const currentCode = codeMap.get(roomId) || '';
        socket.emit(SOCKET_EVENTS.CODE.SYNC, { code: currentCode });
    });

    // Leave Room
    socket.on(SOCKET_EVENTS.ROOM.LEAVE, ({ roomId, username }) => {
        userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id);
        socket.leave(roomId);
    });

    socket.on(SOCKET_EVENTS.ROOM.GET_USERS, ({ roomId }) => {
        broadcastUsers(roomId);
    });

    // Code Events
    socket.on(SOCKET_EVENTS.CODE.CHANGE, ({ roomId, code }) => {
        codeMap.set(roomId, code);
        socket.to(roomId).emit(SOCKET_EVENTS.CODE.UPDATE, { code });
    });

    socket.on(SOCKET_EVENTS.CODE.CURSOR_MOVE, ({ roomId, username, cursor }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CODE.CURSOR_UPDATE, { username, cursor });
    });

    // Chat Events
    socket.on(SOCKET_EVENTS.CHAT.SEND_MESSAGE, ({ roomId, username, message }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CHAT.NEW_MESSAGE, { username, message });
    });

    socket.on(SOCKET_EVENTS.CHAT.TYPING, ({ roomId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CHAT.TYPING, { username });
    });

    socket.on(SOCKET_EVENTS.CHAT.STOP_TYPING, ({ roomId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CHAT.STOP_TYPING, { username });
    });

    // Versioning
    socket.on(SOCKET_EVENTS.VERSIONING.SAVE, ({ roomId, code }) => {
    });

    socket.on(SOCKET_EVENTS.VERSIONING.LOAD_VERSION, ({ roomId, versionIndex }) => {
    });

    // Execute Code
    socket.on(SOCKET_EVENTS.EXECUTION.RUN, ({ roomId, code, language }) => {
        // executeCode(code, language, (output) => {
        //     io.to(roomId).emit(SOCKET_EVENTS.EXECUTION.RESULT, { output });
        // });
    });

    // Handle Disconnection
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id);
    });
});

// Broadcast users in a room
function broadcastUsers(roomId) {
    const users = getUsersInRoom(roomId);
    io.to(roomId).emit(SOCKET_EVENTS.ROOM.USER_LIST, users);
}

// Get all users in a room
function getUsersInRoom(roomId) {
    return userSocketMap.filter((user) => user.roomId === roomId);
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});