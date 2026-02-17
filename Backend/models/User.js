import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // 🔐 DO NOT allow client to set this freely
    role: { type: String, enum: ["user", "admin"], default: "user" },

    address: {
      street: String,
      city: String,
      zipCode: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
