import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 } as AppError;
  }

  // Mongoose duplicate key
  if (err.name === "MongoError" && (err as any).code === 11000) {
    const message = "Duplicate field value entered";
    error = { message, statusCode: 400 } as AppError;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(", ");
    error = { message, statusCode: 400 } as AppError;
  }

  const response: ApiResponse<null> = {
    success: false,
    message: error.message || "Server Error",
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.stack,
  };

  res.status(error.statusCode || 500).json(response);
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message: `Not found - ${req.originalUrl}`,
  };
  res.status(404).json(response);
};
