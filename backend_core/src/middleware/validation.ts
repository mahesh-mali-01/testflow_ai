import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ApiResponse } from "../types";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Validation Error",
        error: error.details.map((detail) => detail.message).join(", "),
      };
      res.status(400).json(response);
      return;
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Query Validation Error",
        error: error.details.map((detail) => detail.message).join(", "),
      };
      res.status(400).json(response);
      return;
    }

    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Parameter Validation Error",
        error: error.details.map((detail) => detail.message).join(", "),
      };
      res.status(400).json(response);
      return;
    }

    next();
  };
};
