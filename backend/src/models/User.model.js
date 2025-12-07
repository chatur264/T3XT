import mongoose from "mongoose"
//Create Schema:-
const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minLength: 8
        },
        profilePic: {
            type: String,
            default: ""
        },
        lastSeen: { type: Date }

    },
    {
        timeStamps: true
    }
);

//Create model:-
const User = mongoose.model("User", UserSchema);

//export model:
export default User;