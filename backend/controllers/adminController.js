import { User } from "../models/User.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ErrorHandler } from "../middleware/errormiddleware.js";
import {Subject} from "../models/SubjectSchema.js"
import { Forum } from "../models/Forum.js";
import { createAndSendNotification } from "./notificationController.js";

// CREATE QUESTION (Admin/Teacher)
export const createQuestion = catchAsyncError(async (req, res, next) => {
  const question = await Forum.create({
    ...req.body,
    user: req.user.id,
  });

  // Notify all students
  const students = await User.find({ role: "student" });
  for (const student of students) {
    await createAndSendNotification({
      recipient: student._id,
      title: "New Question Added! ❓",
      message: `A new question has been added in ${question.subject}. Check it out!`,
      type: "system",
      link: "/forum", // Assuming forum is where questions are
    });
  }

  res.status(201).json({
    success: true,
    question,
  });
});

export const getAllQuestions = catchAsyncError(async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = 10;
  const keyword = req.query.keyword?.trim() || "";

  const matchStage = keyword
    ? {
        $or: [
          { question: { $regex: keyword, $options: "i" } },
          { "user.name": { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

  const aggregateQuery = [
    {
      $lookup: {
        from: "users", // collection name
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // 🔍 search on question + user.name
    { $match: matchStage },

    { $sort: { createdAt: -1 } },

    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const questions = await Forum.aggregate(aggregateQuery);

  const totalAgg = await Forum.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $match: matchStage },
    { $count: "total" },
  ]);

  const total = totalAgg[0]?.total || 0;

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(total / limit),
    totalQuestions: total,
    questions,
  });
});


export const deleteQuestion = catchAsyncError(async (req, res, next) => {
  const question = await Forum.findById(req.params.id);

  if (!question) {
    return next(new ErrorHandler("Question not found", 404));
  }

  await question.deleteOne();

  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});



// UPDATE QUESTION
export const updateQuestion = catchAsyncError(async (req, res, next) => {
  const question = await Forum.findById(req.params.id);

  if (!question) {
    return next(new ErrorHandler("Question not found", 404));
  }

  const updatedQuestion = await Forum.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    question: updatedQuestion,
  });
});


// GET ALL USERS
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    users,
  });
});


// CHANGE ROLE
export const changeRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.role = req.body.role;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Role updated",
    user,
  });
}); 


// DELETE USER
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  console.log(user);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted",
  });
});  

export const toggleBlockUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: user.isBlocked ? "User blocked" : "User unblocked",
    user,
  });
});

export const addSubject = catchAsyncError(async (req, res, next) => {
  let { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Subject name is required", 400));
  }

  // 🔥 normalize
  name = name.trim().toLowerCase();

  const existing = await Subject.findOne({ name });

  if (existing) {
    return next(new ErrorHandler("Subject already exists", 400));
  }

  const subject = await Subject.create({ name });

  res.status(201).json({
    success: true,
    subject,
  });
});



export const getSubjects = catchAsyncError(async (req, res, next) => {
  const subjects = await Subject.find();

  // remove duplicates
  const uniqueSubjects = Object.values(
    subjects.reduce((acc, curr) => {
      const key = curr.name.toLowerCase().trim();
      if (!acc[key]) acc[key] = curr;
      return acc;
    }, {})
  );

  res.status(200).json({
    success: true,
    subjects: uniqueSubjects,
  });
});


// DELETE SUBJECT
export const deleteSubject = catchAsyncError(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(new ErrorHandler("Subject not found", 404));
  }

  const relatedQuestions = await Forum.find({ subject: subject.name });

if (relatedQuestions.length > 0) {
  return next(
    new ErrorHandler("Cannot delete subject with existing questions", 400)
  );
}

  await subject.deleteOne();

  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});


// GET ALL ANSWERS WITH DETAILS
export const getAllAnswers = catchAsyncError(async (req, res, next) => {
  const data = await Forum.find()
    .populate("user", "name") // question creator (teacher/user)
    .populate("answers.user", "name");

  res.status(200).json({
    success: true,
    data,
  });
});


