import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { verifyToken } from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("adultCount")
      .notEmpty()
      .isNumeric()
      .withMessage("AdultCount is required and must be a number"),
    body("childCount")
      .notEmpty()
      .isNumeric()
      .withMessage("ChildCount is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("PricePerNight is required and must be a number"),
    body("starRating")
      .notEmpty()
      .isNumeric()
      .withMessage("StarRating is required and must be a number"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("---HERE");
      const imageFiles = req.files as Express.Multer.File[];
      let newHotel = req.body;
      const lastUpdated = new Date();
      const userId = req.userId;

      const uploadPromises = imageFiles.map(async image => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      console.log("--move");
      newHotel = {
        ...newHotel,
        imageUrls,
        lastUpdated,
        userId
      };

      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).send(hotel);
    } catch (err: any) {
      next(err);
    }
  }
);

router.get(
  "/",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      const hotels = await Hotel.find({ userId });
      res.json(hotels);
    } catch (err) {
      return next(err);
    }
  }
);

export default router;