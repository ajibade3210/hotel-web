import express from "express";
import { check } from "express-validator";
import { register } from "../controllers/users";
import { registerValidation, validate } from "../services/validation";

const router = express.Router();

router.post("/register", registerValidation(), validate, register);

export default router;
