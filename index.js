import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import commentRoutes from "./routes/comment.route.js";
import videoRoutes from "./routes/video.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

const connect = () => {
    mongoose
        .connect(process.env.MONGO)
        .then(() => {
            console.log("DB is connected !");
        })
        .catch((err) => {
            throw err;
        });
};

app.get("/", (req, res) => {
    res.send("Server is connected !");
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/videos", videoRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

app.listen(process.env.PORT || 5000, () => {
    connect();
    console.log("Server is connected !");
});
