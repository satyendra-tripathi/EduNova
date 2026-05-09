

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String, 
      required: function() { return this.authProvider === "local"; }, 
      select: false 
    },

    role: { 
      type: String, 
      enum: ["student", "teacher", "admin"], 
      default: "student" 
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    isBlocked: {
      type: Boolean,
      default: false
    },

    // =====================
    // PROFILE IMAGE
    // =====================
    avatar: {
      public_id: String,
      url: String,
    },

    // =====================
    // EMAIL VERIFICATION
    // =====================
    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: String,
    emailVerificationExpire: Date,
  },
  { timestamps: true }
);

// =====================
// HASH PASSWORD
// =====================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// =====================
// MATCH PASSWORD
// =====================
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// =====================
// GENERATE EMAIL VERIFY TOKEN
// =====================
userSchema.methods.generateEmailVerifyToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.emailVerificationExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return token;
};

export const User = mongoose.model("User", userSchema);
