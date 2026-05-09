
export class ErrorHandler extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
  }
}

export const errormiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statuscode = err.statuscode || 500;

  if (err.code === 11000) {
    err = new ErrorHandler("Duplicate field value entered", 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid JSON Web Token. Try again.", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token expired. Try again.", 400);
  }

  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors).map((error) => error.message)
    : err.message;

  return res.status(err.statuscode).json({
    success: false,
    message: errorMessage,
  });
};