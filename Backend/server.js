import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/Auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added for form data
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API is running..." });
});

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Stop the process if DB fails
    });

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});