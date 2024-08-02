import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signIn = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Password or Email is invalid" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });
    res.status(200).json({ userId: user._id });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send({ message: "Something went wrong" });
  }
};

export const validateToken = (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
};

export const signOut = (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0), // Unix epoch
  });
  res.send({});
};
