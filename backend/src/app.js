import express from "express"
import path from "path"
const app = express();
const __dirname = path.resolve();

import dotenv from "dotenv"
dotenv.config();
const PORT = process.env.PORT || 7777

import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'


app.use("/api/auth", authRoute)
app.use("/api/message", messageRoute)



//make ready for deployment
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get((_, res) => {
        res.send(path.join(__dirname, "..", "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
}) 