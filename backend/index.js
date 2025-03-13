import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// In-memory user storage
let userSocketMap = [];

// Handle socket connections
io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("message", (data) => {
        console.log(`Message received: ${data}`);
        io.emit("message", data);
    });

    socket.on("join-room", ({ roomId, username }) => {
        const user = { socketId: socket.id, username, roomId };
        userSocketMap.push(user);
        socket.join(roomId);
        console.log(`${username} joined room ${roomId}`);

        io.to(roomId).emit("user-joined", { user, users: getUsersInRoom(roomId) });
    });


    socket.on("disconnect", () => {
        userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id);
        console.log("User disconnected:", socket.id);
    });
});

// Get all users in a room
function getUsersInRoom(roomId) {
    return userSocketMap.filter((user) => user.roomId === roomId);
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

