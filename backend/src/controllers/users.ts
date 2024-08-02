import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    user = new User(req.body);
    await user.save();

    // sign token
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
    res.status(200).send({ message: "User registered Ok" });
  } catch (err: any) {
    console.log("err: ", err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
