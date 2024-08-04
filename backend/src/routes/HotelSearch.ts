import express from "express";
import { verifyToken } from "../middleware/auth";
import { hotelSearch } from "../controllers/hotelSearch";
const router = express.Router();

router.get("/search", hotelSearch);

export default router;
