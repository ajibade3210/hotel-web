import express from "express";
import { verifyToken } from "../middleware/auth";
import { signIn, signOut, validateToken } from "../controllers/auth";
import { loginValidation, validate } from "../services/validation";

const router = express.Router();

router.post("/login", loginValidation(), validate, signIn);

router.get("/validate-token", verifyToken, validateToken);

router.post("/logout", signOut);

export default router;
