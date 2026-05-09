// models/Quiz.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOption: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    questions: [questionSchema], // ✅ multiple questions (20-25)

    duration: {
      type: Number, // seconds (e.g. 600 = 10 min)
      required: true,
    },

    isActive: {
      type: Boolean,
      default: false, // admin jab start kare tab true
    },

    startedAt: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const AdminQuiz = mongoose.model("AdminQuiz", QuizSchema);