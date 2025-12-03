import { getReceiverSocketId, io } from "../lib/socket.js";
import LastMessage from "../models/LastMessage.model.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filterUsers)
    } catch (error) {
        console.log("Error in getAllContacts:", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getMessagesByOtherUser = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: otherUserId } = req.params;
        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: myId },
            ],
        })

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in getMessagesByOtherUser:", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }

        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }

        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        let imageUrl;
        if (image) {
            //upload the image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message(
            {
                senderId,
                receiverId,
                text,
                image: imageUrl
            },
        )
        await newMessage.save();

        // 1) Find or Create lastConversation
        let lastConversation = await LastMessage.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!lastConversation) {
            lastConversation = await LastMessage.create({
                participants: [senderId, receiverId],
            });
        }

        // 3) Update lastMessage & lastMessageTime
        lastConversation.lastMessageText = text;
        lastConversation.lastMessageTime = new Date();
        await lastConversation.save();

        //! todo: send message in real-time if user is online - socket.io
        // Emit to receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Emit to sender (so your own chat list updates live)
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", newMessage);
        }


        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({
            message: "Internal"
        })
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;


        //find all the messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        })

        //now extract the other side users ids
        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString())
            )
        ]

        //now get all the users from those ids
        const chatPartners = await User.find({
            _id: { $in: chatPartnerIds }
        }).select("-password");

        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getLastConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // Find all last messages where loggedIn user is one of the participants
        const lastConversations = await LastMessage.find({
            participants: { $in: [loggedInUserId] }
        }).sort({ lastMessageTime: -1 }); // sort by latest first

        res.status(200).json(lastConversations);
    } catch (error) {
        console.log("Error in getLastConversations:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
