import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      
    },

    teacher: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: false 
    }
  },
  { timestamps: true }
);

export const Subject =mongoose.model("Subject", subjectSchema);