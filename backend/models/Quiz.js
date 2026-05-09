import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Quiz = mongoose.model("Quiz", quizSchema);
