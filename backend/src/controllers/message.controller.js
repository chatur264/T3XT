import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import cloudinary from "cloudinary"

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
        //! todo: send message in real-time if user is online - socket.io
        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({
            message: "Internal server error"
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