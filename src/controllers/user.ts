import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import User from "../models/user";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, email } = req.body;
  // Create new user
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });
    await user.save();
    res.status(201).json({
      message: "User created successfully!",
    });
  } catch (e: any) {
    res.status(500).json({
      message: e.message || "An error occured!",
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    // Check if user not exists
    if (!user) {
      throw new Error("User not found!");
    }

    // Check user password is not correct
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error("Passwords are don't match!");
    }

    // Create token
    const token = jwt.sign(
      {
        username,
      },
      process.env.JWT_PASSPHRASE!,
      { expiresIn: "1h" }
    );

    // Send login credentials
    res.status(200).json({
      token,
      user: user._id,
    });
  } catch (e: any) {
    res.status(500).json({
      message: e.message || "An error occured!",
    });
  }
};

const userControllers = {
  signup,
  login,
};

export default userControllers;
