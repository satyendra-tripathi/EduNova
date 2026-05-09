import { Quiz } from "../models/Quiz.js";
import { QuizAnswer } from "../models/QuizAnswer.js";
import { QuizPoints } from "../models/QuizPoint.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { ErrorHandler } from "../middleware/errormiddleware.js";
import { sendToGeminiAI } from "../utils/sendToGemini.js";

// Generate multiple quiz questions
export const generateQuiz = catchAsyncError(async (req, res, next) => {
  const { subject, count } = req.body;
  if(!subject) return next(new ErrorHandler("Subject required", 400));

  const questions = await sendToGeminiAI("quiz", subject, count || 10);

  if(!questions || questions.length === 0) 
    return next(new ErrorHandler("AI could not generate questions", 500));

  const insertedQuizzes = await Quiz.insertMany(
    questions.map(q => ({
      subject,
      question: q.question,
      options: q.options,
      correctOption: q.correctOption
    }))
  );

  res.status(201).json({ success: true, insertedQuizzes });
});

// Submit answer and get reason if wrong
export const submitAnswer = catchAsyncError(async (req, res, next) => {
  const { quizId } = req.params;
  const { answer } = req.body;
  const userId = req.user._id;

  const quiz = await Quiz.findById(quizId);
  if(!quiz) return next(new ErrorHandler("Quiz not found", 404));

  const isCorrect = answer === quiz.correctOption;

  const quizAnswer = await QuizAnswer.create({
    user: userId,
    quiz: quizId,
    answer,
    isCorrect
  });

  // Update points
  let userPoints = await QuizPoints.findOne({ user: userId });
  if(!userPoints) {
    userPoints = await QuizPoints.create({ user: userId, points: isCorrect ? 1 : 0 });
  } else if(isCorrect) {
    userPoints.points += 1;
    userPoints.updatedAt = new Date();
    await userPoints.save();
  }

  // Galat hone par AI se reason mangna
  let reason = null;
  if(!isCorrect) {
    reason = await sendToGeminiAI("reason", { question: quiz.question, answer });
  }

  res.status(200).json({
    success: true,
    message: isCorrect ? "Correct answer!" : "Incorrect answer",
    correctAnswer: quiz.correctOption,
    reason,
    quizAnswer
  });
});
// AI Quiz Generation for Teachers/Admins
export const generateAIQuiz = catchAsyncError(async (req, res, next) => {
  const { subject, topic, difficulty, count, questionType } = req.body;

  if (!subject || !topic) {
    return next(new ErrorHandler("Subject and Topic are required", 400));
  }

  const aiData = {
    subject,
    topic,
    difficulty: difficulty || "medium",
    questionType: questionType || "mcq"
  };

  const questions = await sendToGeminiAI("ai-quiz", aiData, count || 5);

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return next(new ErrorHandler("AI failed to generate valid quiz questions. Please try again.", 500));
  }

  // Validate the structure of each question
  const validatedQuestions = questions.map(q => ({
    question: q.question || "Untitled Question",
    options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option 1", "Option 2", "Option 3", "Option 4"],
    correctOption: q.correctAnswer || q.correctOption || "",
    explanation: q.explanation || "No explanation provided."
  }));

  res.status(200).json({
    success: true,
    questions: validatedQuestions
  });
});
