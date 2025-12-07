import mongoose from "mongoose"

const lastMessageSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],

    lastMessageText: {
        type: String
    },

    lastMessageTime: {
        type: Date
    },

    unreadMessages: {
        type: Number,
        default: 0
    },
    
    lastMessageSenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true
})

const LastMessage = mongoose.model("LastMessage", lastMessageSchema)
export default LastMessage;