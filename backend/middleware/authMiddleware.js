import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ErrorHandler } from "./errormiddleware.js";

export const isAuthenticated = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User no longer exists", 401));
    }

    if (user.isBlocked) {
      return next(new ErrorHandler("You are blocked", 403));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token, please login again", 401));
  }
};
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User not found", 401));
    }

    if (req.user.isBlocked) {
      return next(new ErrorHandler("You are blocked", 403));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};


export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Not authenticated", 401));
  }

  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied", 403));
  }

  next();
};