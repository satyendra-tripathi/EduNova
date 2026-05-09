

import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // Total points accumulated from Progress
  totalPoints: { type: Number, default: 0 },

  // Track weekly streak or consecutive days
  streak: { type: Number, default: 0 },

  // Last activity date (helpful for tie-breakers in ranking)
  lastActivity: { type: Date, default: Date.now },

  // Optional: badges or levels
  level: { type: String, default: "Beginner" },

  // Subject-wise points (e.g. { "Math": 10, "Science": 5 })
  subjectWisePoints: { type: Map, of: Number, default: {} }

}, { timestamps: true });

// ✅ Prevent OverwriteModelError
export const Leaderboard = mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema);
