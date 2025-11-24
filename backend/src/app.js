import express from "express"
import path from "path"
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import profileRoute from './routes/profile.route.js'

import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express();

dotenv.config();
const PORT = process.env.PORT || 7777

const __dirname = path.resolve();



app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true //for cookie 
}));

app.set("trust proxy", true);
app.use((req, _, next) => {
    if (!req.headers["x-forwarded-for"]) {
        req.headers["x-forwarded-for"] = "203.0.113.20"; // fake public IP
    }
    next();
});


app.use("/api/auth", authRoute)
app.use("/api/message", messageRoute)
app.use("/api/profile", profileRoute)



//make ready for deployment
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get((_, res) => {
        res.send(path.join(__dirname, "..", "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB();
}) 