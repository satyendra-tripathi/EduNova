// backend/controllers/teacherController.js
import { Leaderboard } from "../models/LeaderBoard.js";
import { Progress } from "../models/Progress.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ErrorHandler } from "../middleware/errormiddleware.js";
import { startOfWeek, endOfWeek } from "date-fns";



// -------------------------
// 1️ Day-wise performance for a student
export const getStudentDailyPerformance = catchAsyncError(async (req, res, next) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return next(new ErrorHandler("Invalid student ID", 400));
  }

  const dailyProgress = await Progress.find({ user: studentId }).sort({ date: 1 });

  res.status(200).json({ success: true, dailyProgress });
});

// -------------------------
// 2️ Weekly subject-wise performance for a student
export const getStudentWeeklyPerformance = catchAsyncError(async (req, res, next) => {
  const { studentId } = req.params;
  let { weekStart, weekEnd } = req.query;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return next(new ErrorHandler("Invalid student ID", 400));
  }

  const today = new Date();
  const start = weekStart ? new Date(weekStart) : startOfWeek(today, { weekStartsOn: 1 });
  const end = weekEnd ? new Date(weekEnd) : endOfWeek(today, { weekStartsOn: 1 });

  const weeklyPerformance = await Progress.aggregate([
    {
      $match: {
        user:new mongoose.Types.ObjectId(studentId),
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

  res.status(200).json({
    success: true,
    weekStart: start,
    weekEnd: end,
    weeklyPerformance,
  });
});

// -------------------------
// 3️⃣ Subject-wise overall performance for a student
export const getStudentSubjectStats = catchAsyncError(async (req, res, next) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return next(new ErrorHandler("Invalid student ID", 400));
  }

  const subjectStats = await Progress.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: "$subject",
        totalScore: { $sum: "$score" },
        totalCorrect: { $sum: "$correctAnswers" },
        totalWrong: { $sum: "$wrongAnswers" },
      },
    },
  ]);

  res.status(200).json({ success: true, subjectStats });
});

// -------------------------
// 4️⃣ Top N students overall
export const getTopStudents = catchAsyncError(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;

  const topStudents = await Leaderboard.find({})
    .populate("student", "name role")
    .sort({ totalPoints: -1 })
    .limit(limit);

  res.status(200).json({ success: true, topStudents });
});


export const getTopStudentsBySubject = catchAsyncError(async (req, res, next) => {
  const subjectAgg = await Progress.aggregate([
    {
      $group: {
        _id: { student: "$user", subject: "$subject" },
        totalScore: { $sum: "$score" }
      }
    },
    { $sort: { "_id.subject": 1, totalScore: -1 } }
  ]);

  const subjectRanking = {};
  subjectAgg.forEach((item) => {
    const subject = item._id.subject;
    if (!subjectRanking[subject]) subjectRanking[subject] = [];
    subjectRanking[subject].push({
      student: item._id.student,
      totalScore: item.totalScore
    });
  });

  res.status(200).json({ success: true, subjectRanking });
});



