import express from "express";
import { bookings } from "../controllers/hotelSearch";
import { verifyToken } from "../middleware/auth";
import { getMyBookings } from "../controllers/booking";
const router = express.Router();

router.get("/", verifyToken, getMyBookings);

export default router;
