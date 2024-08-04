// export default router;
import express from "express";
import { verifyToken } from "../middleware/auth";
import { upload } from "../services/upload";
import {
  addHotel,
  fetchMyHotels,
  fetchMyHotelsById,
  updateHotel,
} from "../controllers/myHotels";
import { addMyHotelValidation } from "../services/validation";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  addMyHotelValidation(),
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
