import { Leaderboard } from "../models/LeaderBoard.js";
import { Progress } from "../models/Progress.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ErrorHandler } from "../middleware/errormiddleware.js";
import { startOfWeek, endOfWeek } from "date-fns";

// 1️⃣ Top N students overall
export const getTopStudents = catchAsyncError(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;

  const topStudents = await Leaderboard.find({})
    .populate("student", "name role")
    .sort({ totalPoints: -1 })
    .limit(limit);

  res.status(200).json({ success: true, topStudents });
});

// 2️⃣ Single student day-wise performance
export const getStudentDailyPerformance = catchAsyncError(async (req, res, next) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return next(new ErrorHandler("Invalid student ID", 400));
  }

  const dailyProgress = await Progress.find({ user: studentId }).sort({ date: 1 });

  res.status(200).json({ success: true, dailyProgress });
});




// backend/controllers/leaderboardController.js
export const getSubjectWiseRanking = catchAsyncError(async (req, res) => {
  const subjectAgg = await Progress.aggregate([
    { $match: { subject: { $ne: null } } },
    { 
      $group: { 
        _id: { student: "$user", subject: "$subject" },
        totalScore: { $sum: "$score" },
        totalCorrect: { $sum: "$correct" }, // agar correct field hai
        totalWrong: { $sum: "$wrong" }      // agar wrong field hai
      } 
    },
    { $sort: { "_id.subject": 1, totalScore: -1 } },
    { 
      $lookup: {
        from: "users",
        localField: "_id.student",
        foreignField: "_id",
        as: "studentDetails"
      } 
    },
    { $unwind: "$studentDetails" }
  ]);

  const subjectRanking = {};

  subjectAgg.forEach(item => {
    const subject = item._id.subject;
    if (!subjectRanking[subject]) subjectRanking[subject] = [];

    subjectRanking[subject].push({
      studentId: item._id.student,
      name: item.studentDetails.name || item.studentDetails.username,
      email: item.studentDetails.email,
      totalScore: item.totalScore,
      totalCorrect: item.totalCorrect ?? 0,
      totalWrong: item.totalWrong ?? 0
    });
  });

  // Assign rank per subject
  Object.keys(subjectRanking).forEach(subject => {
    subjectRanking[subject] = subjectRanking[subject].map((s, idx) => ({
      ...s,
      rank: idx + 1
    }));
  });

  res.status(200).json({
    success: true,
    subjectRanking
  });
});



// 4️⃣ Single student subject-wise points & rank
export const getStudentSubjectStats = catchAsyncError(async (req, res, next) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return next(new ErrorHandler("Invalid student ID", 400));
  }

  const studentSubjects = await Progress.aggregate([
    { $match: { user:new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: "$subject",
        totalScore: { $sum: "$score" },
        totalCorrect: { $sum: "$correctAnswers" },
        totalWrong: { $sum: "$wrongAnswers" },
      }
    }
  ]);

  const subjectRanks = {};
  for (const subj of studentSubjects) {
    const ranking = await Progress.aggregate([
      { $match: { subject: subj._id } },
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" }
        }
      },
      { $sort: { totalScore: -1 } }
    ]);

    const rank = ranking.findIndex(r => r._id.toString() === studentId.toString()) + 1;
    subjectRanks[subj._id] = { ...subj, rank };
  }

  res.status(200).json({ success: true, subjectStats: subjectRanks });
});

// 5️⃣ Weekly subject-wise performance & ranking
export const getWeeklySubjectStats = catchAsyncError(async (req, res, next) => {
  const { studentId } = req.params;
  let { weekStart, weekEnd } = req.query;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return next(new ErrorHandler("Invalid student ID", 400));
  }

  // Default to current week if not provided
  const today = new Date();
  const start = weekStart ? new Date(weekStart) : startOfWeek(today, { weekStartsOn: 1 });
  const end = weekEnd ? new Date(weekEnd) : endOfWeek(today, { weekStartsOn: 1 });

  // Aggregate weekly performance per subject for this student
  const weeklyPerformance = await Progress.aggregate([
    {
      $match: {
        user:new mongoose.Types.ObjectId(studentId),
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: "$subject",
        totalScore: { $sum: "$score" },
        totalCorrect: { $sum: "$correctAnswers" },
        totalWrong: { $sum: "$wrongAnswers" }
      }
    }
  ]);

  // Subject-wise ranking within the week
  const weeklySubjectRanking = {};
  for (const subj of weeklyPerformance) {
    const ranking = await Progress.aggregate([
      {
        $match: {
          subject: subj._id,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" }
        }
      },
      { $sort: { totalScore: -1 } }
    ]);

    const rank = ranking.findIndex(r => r._id.toString() === studentId.toString()) + 1;
    weeklySubjectRanking[subj._id] = { ...subj, rank };
  }

  res.status(200).json({
    success: true,
    weekStart: start,
    weekEnd: end,
    weeklySubjectStats: weeklySubjectRanking
  });
});
