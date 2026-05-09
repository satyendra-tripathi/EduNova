import mongoose from "mongoose";

const quizAnswerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const QuizAnswer = mongoose.model("QuizAnswer", quizAnswerSchema);
