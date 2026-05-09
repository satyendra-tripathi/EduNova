import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // human user ID
    role: { type: String, enum: ["student", "teacher", "admin","ai"], required: true },
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // links AI response to the human who asked
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
