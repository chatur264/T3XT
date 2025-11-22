import jwt from "jsonwebtoken"
import "dotenv/config"
import User from "../models/User.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const { jwtToken } = req.cookies;
        if (!jwtToken) {
            return res.status(400).json({
                message: "Unotherized - No token provided"
            })
        }

        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(400).json({
                message: "Unotherized - Invalid token"
            })
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        //attach the user
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}