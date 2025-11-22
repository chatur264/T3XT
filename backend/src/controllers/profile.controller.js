import User from "../models/User.model.js";
import "dotenv/config"
import cloudinary
    from "../lib/cloudinary.js";
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            res.status(400).json({
                meassage: "Profile pic required"
            });
        }

        const userId = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,
            { ProfilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password")

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in profile controller: ", error);
        res.status(500).json(
            { message: "Internal server error" }
        )

    }
}
