// import mongoose from "mongoose";

// const contentSchema = new mongoose.Schema({
//   subject: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Subject", 
//     required: true 
//   },

//   teacher: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: true 
//   },

//   title: { type: String, required: true },

//   type: { 
//     type: String, 
//     enum: ["pdf", "video"], 
//     required: true 
//   },

//   fileUrl: { type: String },   // PDF
//   videoUrl: { type: String },  // Video

//   createdAt: { type: Date, default: Date.now }
// });

// export const Content = mongoose.model("Content", contentSchema);

import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },

  type: {
    type: String,
    enum: ["pdf", "video"],
    required: true,
  },

  fileUrl: {
    type: String,
    required: true, 
  },

  public_id: {
    type: String,
    required: true, 
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Content = mongoose.model("Content", contentSchema);