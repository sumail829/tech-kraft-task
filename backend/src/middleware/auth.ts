import { Request, Response, NextFunction } from "express";

// Extend Express Request to carry isAdmin flag
declare global {
  namespace Express {
    interface Request {
      isAdmin: boolean;
    }
  }
}

// Simulated auth middleware
// In real apps this would verify a JWT token
// Here we read x-admin: "true" header to simulate admin role
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.isAdmin = req.headers["x-admin"] === "true";
  next();
};