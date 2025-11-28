import http from "http"
import "dotenv/config"
import { socketAuthMiddleware } from "../middlewares/socketAuthMiddleware.js";
import { Server } from "socket.io";
import express from "express"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
})

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//this is for storing online users
const userSocketMap = {}; //{userId-->socketId}

io.on("connection", (socket) => {
    console.log("A User connected", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    //online users info to all other connected  users
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];

        ///now rethrow the notification
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { server, app, io }