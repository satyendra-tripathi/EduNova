import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Notes = mongoose.model("Notes", notesSchema);
