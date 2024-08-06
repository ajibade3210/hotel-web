import express from "express";
import { check } from "express-validator";
import { getLoginUser, register } from "../controllers/users";
import { registerValidation, validate } from "../services/validation";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, getLoginUser )

router.post("/register", registerValidation(), validate, register);

export default router;
