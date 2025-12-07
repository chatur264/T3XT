import http from "http"
import "dotenv/config"
import { socketAuthMiddleware } from "../middlewares/socketAuthMiddleware.js";
import { Server } from "socket.io";
import express from "express"
import LastMessage from "../models/LastMessage.model.js";
import User from "../models/User.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://t3xt-frontend.vercel.app",
            "https://t3xt-frontend-git-main-sachin-kumars-projects-54c2c5aa.vercel.app"
        ],
        credentials: true,
    },
    transports: ["polling"]
})

// apply authentication middleware to all socket connections: to get the connected user info and userID to Socket
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//this is for storing online users
const userSocketMap = {}; //{userId-->socketId}
export let onlineUsersCurrentChat = {};

io.on("connection", (socket) => {
    console.log("A User connected", socket.user.fullName);

    socket.on("typing", ({ to, from }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { from });
        }
    });

    socket.on("stopTyping", ({ to, from }) => {
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { from });
        }
    });

    socket.on("openChat", async ({ chatWith }) => {
        // user kis chat ko dekh rha h
        onlineUsersCurrentChat[socket.userId] = chatWith;

        // unread ko turant reset karo
        await LastMessage.findOneAndUpdate(
            { participants: { $all: [socket.userId, chatWith] } },
            { unreadMessages: 0 }
        )
    });

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    //online users info to all other connected users
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", async () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];

        //update his last seen
        await User.findByIdAndUpdate(userId, {
            lastSeen: new Date()
        })

        ///now rethrow the rest online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { server, app, io }