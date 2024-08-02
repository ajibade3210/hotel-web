import express from "express";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

import {
  addHotel,
  fetchMyHotels,
  fetchMyHotelsById,
  updateHotel,
} from "../controllers/myHotels";
import { validate, addMyHotelValidation } from "../services/validation";
import { upload } from "../services/upload";

router.post(
  "/",
  verifyToken,
  addMyHotelValidation(),
  validate,
  upload.array("imageFiles", 6),
  addHotel
);

router.get("/", verifyToken, fetchMyHotels);

router.get("/:id", verifyToken, fetchMyHotelsById);

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles", 6),
  updateHotel
);

export default router;
