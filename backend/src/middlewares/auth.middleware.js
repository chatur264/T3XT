import jwt from "jsonwebtoken"
import "dotenv/config"
import User from "../models/User.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken || req.cookies._vercel_jwt;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};