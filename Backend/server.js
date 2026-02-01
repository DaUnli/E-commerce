import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/Auth.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // your React app
  credentials: true, // allow cookies
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api", authRoutes);

app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
