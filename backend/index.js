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
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// In-memory storage for users and versions
let userSocketMap = [];
const codeVersions = {};

// Handle socket connections
io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`[CONNECTED] User: ${socket.id}`);

    // Authenticate user
    socket.on(SOCKET_EVENTS.AUTHENTICATE, ({ username }) => {
        console.log(`[AUTH] User authenticated: ${username}`);
    });

    // Join Room
    socket.on(SOCKET_EVENTS.ROOM.JOIN, ({ roomId, username }) => {
        const user = { socketId: socket.id, username, roomId };
        userSocketMap.push(user);
        socket.join(roomId);

        console.log(`[JOIN] ${username} joined room ${roomId}`);
        broadcastUsers(roomId);
    });

    // Leave Room
    socket.on(SOCKET_EVENTS.ROOM.LEAVE, ({ roomId, username }) => {
        userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id);
        socket.leave(roomId);

        console.log(`[LEAVE] ${username} left room ${roomId}`);
        broadcastUsers(roomId);
    });

    // Code Events
    socket.on(SOCKET_EVENTS.CODE.CHANGE, ({ roomId, code }) => {
        console.log(code);
        socket.to(roomId).emit(SOCKET_EVENTS.CODE.UPDATE, { code });
    });

    socket.on(SOCKET_EVENTS.CODE.CURSOR_MOVE, ({ roomId, username, cursor }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CODE.CURSOR_UPDATE, { username, cursor });
    });

    // Chat Events
    socket.on(SOCKET_EVENTS.CHAT.SEND_MESSAGE, ({ roomId, username, message }) => {
        io.to(roomId).emit(SOCKET_EVENTS.CHAT.NEW_MESSAGE, { username, message });
    });

    socket.on(SOCKET_EVENTS.CHAT.TYPING, ({ roomId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CHAT.TYPING, { username });
    });

    socket.on(SOCKET_EVENTS.CHAT.STOP_TYPING, ({ roomId, username }) => {
        socket.to(roomId).emit(SOCKET_EVENTS.CHAT.STOP_TYPING, { username });
    });

    // Versioning
    socket.on(SOCKET_EVENTS.VERSIONING.SAVE, ({ roomId, code }) => {
        if (!codeVersions[roomId]) codeVersions[roomId] = [];
        codeVersions[roomId].push({ code, timestamp: new Date() });

        console.log(`[VERSION] Code saved in room ${roomId}. Total Versions: ${codeVersions[roomId].length}`);

        io.to(roomId).emit(SOCKET_EVENTS.VERSIONING.SAVED, {
            message: "Code saved successfully",
            versions: codeVersions[roomId].length,
        });
    });

    socket.on(SOCKET_EVENTS.VERSIONING.LOAD_VERSION, ({ roomId, versionIndex }) => {
        const versions = codeVersions[roomId] || [];
        if (versionIndex < 0 || versionIndex >= versions.length) {
            socket.emit(SOCKET_EVENTS.ERROR, { message: "Invalid version index" });
            return;
        }

        console.log(`[VERSION] Loaded version ${versionIndex} for room ${roomId}`);

        socket.emit(SOCKET_EVENTS.VERSIONING.VERSION_LOADED, {
            code: versions[versionIndex].code,
            timestamp: versions[versionIndex].timestamp,
        });
    });

    // Execute Code
    socket.on(SOCKET_EVENTS.EXECUTION.RUN, ({ roomId, code, language }) => {
        console.log(`[EXECUTION] Running ${language} code in room ${roomId}`);
        
        // executeCode(code, language, (output) => {
        //     io.to(roomId).emit(SOCKET_EVENTS.EXECUTION.RESULT, { output });
        // });
    });

    // Lock Code (To Be Implemented)
    socket.on(SOCKET_EVENTS.LOCK.CODE_LOCK, ({ roomId, username }) => {
        console.log(`[LOCK] ${username} locked the code in room ${roomId}`);
        // Implement locking mechanism here
    });

    // Handle Disconnection
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id);
        console.log(`[DISCONNECT] User: ${socket.id} disconnected`);
    });
});

// Broadcast users in a room
function broadcastUsers(roomId) {
    const users = getUsersInRoom(roomId);
    console.log(`[ROOM USERS] Room ${roomId} - Users:`, users.map(u => u.username));

    io.to(roomId).emit(SOCKET_EVENTS.ROOM.USER_LIST, users);
}

// Get all users in a room
function getUsersInRoom(roomId) {
    return userSocketMap.filter((user) => user.roomId === roomId);
}

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
