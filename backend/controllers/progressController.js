// backend/controllers/progressController.js

import { Progress } from "../models/Progress.js";
import { Leaderboard } from "../models/LeaderBoard.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ErrorHandler } from "../middleware/errormiddleware.js";
import mongoose from "mongoose";
import { startOfWeek, endOfWeek } from "date-fns";

// 1️⃣ Update progress when student answers a question
// export const updateProgress = catchAsyncError(async (req, res, next) => {
//   const { subject, isCorrect, type } = req.body; // type: "mcq" or "long"
//   const userId = req.user._id;

//   if (!subject || isCorrect === undefined || !type) {
//     return next(new ErrorHandler("Subject, type and correctness are required", 400));
//   }

//   // Find today's record
//   let dailyProgress = await Progress.findOne({
//     user: userId,
//     subject,
//     date: {
//       $gte: new Date().setHours(0, 0, 0, 0),
//       $lte: new Date().setHours(23, 59, 59, 999),
//     },
//   });

//   const points = type === "mcq" ? 1 : 5;

//   if (!dailyProgress) {
//     dailyProgress = await Progress.create({
//       user: userId,
//       subject,
//       correctAnswers: isCorrect ? 1 : 0,
//       wrongAnswers: isCorrect ? 0 : 1,
//       score: isCorrect ? points : 0,
//     });
//   } else {
//     dailyProgress.correctAnswers += isCorrect ? 1 : 0;
//     dailyProgress.wrongAnswers += isCorrect ? 0 : 1;
//     dailyProgress.score += isCorrect ? points : 0;
//     await dailyProgress.save();
//   }

//   // -------------------------------
//   // Update Leaderboard
//   // -------------------------------
//   const totalScoreAgg = await Progress.aggregate([
//     { $match: { user: mongoose.Types.ObjectId(userId) } },
//     { $group: { _id: "$user", totalPoints: { $sum: "$score" } } }
//   ]);

//   await Leaderboard.findOneAndUpdate(
//     { student: userId },
//     { totalPoints: totalScoreAgg[0]?.totalPoints || 0, lastActivity: new Date() },
//     { upsert: true, new: true }
//   );

//   res.status(200).json({ success: true, dailyProgress });
// });


export const updateProgress = catchAsyncError(async (req, res, next) => {
  const { subject, isCorrect, type } = req.body; // type: "mcq" or "long"
  const userId = req.user._id;

  if (!subject || isCorrect === undefined || !type) {
    return next(new ErrorHandler("Subject, type and correctness are required", 400));
  }

  // -------------------------------
  // Find today's record
  // -------------------------------
  let dailyProgress = await Progress.findOne({
    user: userId,
    subject,
    date: {
      $gte: new Date().setHours(0, 0, 0, 0),
      $lte: new Date().setHours(23, 59, 59, 999),
    },
  });

  const points = type === "mcq" ? 1 : 5;

  if (!dailyProgress) {
    dailyProgress = await Progress.create({
      user: userId,
      subject,
      correctAnswers: isCorrect ? 1 : 0,
      wrongAnswers: isCorrect ? 0 : 1,
      score: isCorrect ? points : 0,
    });
  } else {
    dailyProgress.correctAnswers += isCorrect ? 1 : 0;
    dailyProgress.wrongAnswers += isCorrect ? 0 : 1;
    dailyProgress.score += isCorrect ? points : 0;
    await dailyProgress.save();
  }

  // -------------------------------
  // Update Leaderboard (total + subject-wise)
  // -------------------------------
  const totalScoreAgg = await Progress.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$user", totalPoints: { $sum: "$score" } } }
  ]);

  await Leaderboard.findOneAndUpdate(
    { student: userId },
    {
      $set: { lastActivity: new Date() },
      $setOnInsert: { level: "Beginner", streak: 0 },
      $inc: {
        totalPoints: isCorrect ? points : 0,
        [`subjectWisePoints.${subject}`]: isCorrect ? points : 0
      }
    },
    { upsert: true, new: true }
  );

  res.status(200).json({ success: true, dailyProgress });
});


// 2️⃣ Get daily progress for a student
export const getDailyProgress = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const today = new Date();
  const dailyProgress = await Progress.find({
    user: userId,
    date: {
      $gte: new Date(today.setHours(0, 0, 0, 0)),
      $lte: new Date(today.setHours(23, 59, 59, 999)),
    },
  });

  res.status(200).json({ success: true, dailyProgress });
});

// 3️⃣ Get weekly performance (subject-wise)
export const getWeeklyPerformance = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  let { startOfWeek: start, endOfWeek: end } = req.query;

  const today = new Date();

  if (!start || !end) {
    start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    end = endOfWeek(today, { weekStartsOn: 1 });       // Sunday
  } else {
    start = new Date(start);
    end = new Date(end);
  }

  const weeklyPerformance = await Progress.aggregate([
    {
      $match: {
        user:new mongoose.Types.ObjectId(userId),
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$subject",
        totalScore: { $sum: "$score" },
        totalCorrect: { $sum: "$correctAnswers" },
        totalWrong: { $sum: "$wrongAnswers" },
      },
    },
  ]);

  // Optional: calculate weekly rank
  const weeklyRankAgg = await Progress.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: "$user", totalScore: { $sum: "$score" } } },
    { $sort: { totalScore: -1 } }
  ]);
  const weeklyRank = weeklyRankAgg.findIndex(r => r._id.toString() === userId.toString()) + 1;

  res.status(200).json({ success: true, startOfWeek: start, endOfWeek: end, weeklyPerformance, weeklyRank });
});

// 4️⃣ Get overall progress (subject-wise + all-subject total)
export const getOverallProgress = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const overallProgress = await Progress.aggregate([
    { $match: { user:new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$subject",
        totalScore: { $sum: "$score" },
        totalCorrect: { $sum: "$correctAnswers" },
        totalWrong: { $sum: "$wrongAnswers" },
      },
    },
  ]);

  const totalPerformance = overallProgress.reduce(
    (acc, subj) => {
      acc.totalScore += subj.totalScore;
      acc.totalCorrect += subj.totalCorrect;
      acc.totalWrong += subj.totalWrong;
      return acc;
    },
    { totalScore: 0, totalCorrect: 0, totalWrong: 0 }
  );

  res.status(200).json({ success: true, overallProgress, totalPerformance });
});
