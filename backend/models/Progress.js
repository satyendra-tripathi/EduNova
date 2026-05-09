import mongoose from "mongoose";

const dailyProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student
  subject: { type: String, required: true,
    // enum:["Math","English","Science"]
   }, // Subject name
  date: { type: Date, default: Date.now },   // Day of the attempt
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  score: { type: Number, default: 0 }       // Points earned that day
}, { timestamps: true });

export const Progress = mongoose.model("DailyProgress", dailyProgressSchema);
