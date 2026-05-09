import { Message } from "../models/Message.js";
import { sendToGeminiAI } from "../utils/sendToGemini.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

export const sendMessage = catchAsyncError(async (req, res) => {

  

  const { inputText, action, topic, mode, count } = req.body;
  const userId = req.user._id;

  if (!inputText && !topic) {
    return res.status(400).json({ success: false, message: "Input required" });
  }

  // Save student's message
  const studentMessage = await Message.create({
    sender: userId,
    role: req.user.role,
    text: inputText || topic,
    user: userId
  });

  const queryText = inputText || topic;
  let aiResponseText;

  if (action === "explain") {
    const explanationMode = mode || "simple";
    aiResponseText = await sendToGeminiAI("explain", { topic: queryText, mode: explanationMode });
  } else if (action === "quiz" || action === "reason") {
    aiResponseText = await sendToGeminiAI(action, queryText, count || 1);
  } else {
    return res.status(400).json({ success: false, message: "Invalid action type" });
  }

const aiMessage = await Message.create({
  sender: userId,   // ✅ keep same userId
  role: "ai",       // ✅ AI identity here
  text: aiResponseText,
  user: userId
});
  res.status(200).json({
    success: true,
    messages: [studentMessage, aiMessage]
  });
});

export const getChatHistory = catchAsyncError(async (req, res) => {
  const userId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: userId },
      { user: userId }
    ]
  }).sort({ createdAt: 1 });

  res.status(200).json({ success: true, messages });
});


export const clearChatHistory = catchAsyncError(async (req, res) => {
  const userId = req.user._id;

  // Delete all messages related to this user
  await Message.deleteMany({
    $or: [
      { sender: userId },
      { user: userId }
    ]
  });

  res.status(200).json({
    success: true,
    message: "Chat history cleared successfully."
  });
});
