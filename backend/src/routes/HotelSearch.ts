import express from "express";
import { getHotelDetails, hotelSearch } from "../controllers/hotelSearch";
import { getHotelValidation, validate } from "../services/validation";
const router = express.Router();

router.get("/search", hotelSearch);
router.get("/:id", getHotelValidation(), validate, getHotelDetails);

export default router;
