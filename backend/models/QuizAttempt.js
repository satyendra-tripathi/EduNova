import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "AdminQuiz", required: true },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: String,
        isCorrect: Boolean,
      },
    ],
    currentQuestionIndex: { type: Number, default: 0 }, // track progress
    score: { type: Number, default: 0 },
    total: { type: Number },
    title: { type: String },
    startedAt: { type: Date }, // student start time
    duration: { type: Number }, // total duration in seconds
    submitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const QuizAttempt = mongoose.model("QuizAttempt", attemptSchema);