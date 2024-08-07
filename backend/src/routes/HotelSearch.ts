import express from "express";
import {
  bookings,
  getHotelDetails,
  hotelSearch,
  payment,
} from "../controllers/hotelSearch";
import { getHotelValidation, validate } from "../services/validation";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.get("/search", hotelSearch);
router.get("/:id", getHotelValidation(), validate, getHotelDetails);
router.post("/:hotelId/bookings/payment-intent", verifyToken, payment);
router.post("/:hotelId/bookings", verifyToken, bookings);

export default router;
