import mongoose from "mongoose";

const quizPointsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export const QuizPoints = mongoose.model("QuizPoints", quizPointsSchema);
 