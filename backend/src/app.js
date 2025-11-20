import express from "express"
const app = express();

import dotenv from "dotenv"
dotenv.config();
const PORT = process.env.PORT || 7777

import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'

app.use("/api/auth", authRoute)
app.use("/api/message", messageRoute)

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
}) 