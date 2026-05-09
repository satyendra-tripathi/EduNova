import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, // Teacher

  subject: { 
    type: String, 
    required: true ,
    // enum:["Math","Science","English"]
  }, // Subject of the question

  question: { 
    type: String, 
    required: true 
  },

  type: { 
    type: String, 
    enum: ["mcq", "long"], 
    required: true 
  }, // MCQ or Long-answer

  // MCQ-specific fields
  options: {
    type: [String],
    validate: {
      validator: function(v) {
        // If type is MCQ, options array must exist and not empty
        return this.type === "mcq" ? v && v.length > 0 : true;
      },
      message: "MCQ questions must have options"
    }
  },
  correctOption: {
    type: String,
    validate: {
      validator: function(v) {
        // If type is MCQ, correctOption must exist
        return this.type === "mcq" ? v != null : true;
      },
      message: "MCQ questions must have correctOption"
    }
  },

answers: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answer: String,
    isCorrect: { type: Boolean, default: false },
    marks: { type: Number, default: 0 },
    aiEvaluation: {
      score: { type: Number, default: 0 },
      maxMarks: { type: Number, default: 5 },
      feedback: { type: String },
      mistakes: [String],
      improvedAnswer: { type: String },
      evaluatedByAI: { type: Boolean, default: false },
      difficulty: { type: String },
      confidenceScore: { type: Number },
      keywordCoverage: [String],
      grammarScore: { type: Number },
      conceptAccuracy: { type: Number },
      plagiarismWarning: { type: String }
    },
    isEvaluated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }
]

}, { timestamps: true }); // Automatically adds createdAt & updatedAt

export const Forum = mongoose.model("Forum", forumSchema);
