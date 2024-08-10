import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    response.status(401).json({ message: "Unauthorized" });
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // request.user = decoded; // Attach the user payload to the request
    next();
  } catch (error) {
    response.status(401).json({ message: "Unauthorized" });
  }
};
