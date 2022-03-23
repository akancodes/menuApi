import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  // Check Auth Header if not exists
  if (!authHeader) {
    return res.status(400).json({
      message: "You're not authenticated. Please login first.",
    });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_PASSPHRASE!);
  } catch (e: any) {
    res.status(500).json({
      message: e.message || "An error occured!",
    });
  }
  // If token is not valid
  if (!decodedToken) {
    throw new Error("Authentication failed!");
  }
  console.log("Authenticated!", decodedToken);
  next();
};

export default checkAuth;
