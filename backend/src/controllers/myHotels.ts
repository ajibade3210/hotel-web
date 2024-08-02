import { NextFunction, Request, Response } from "express";
import Hotel, { HotelType } from "../models/Hotel";
import { uploadImages } from "../services/upload";

export const fetchMyHotelsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id.toString();
    const hotel = await Hotel.findById({
      _id: id,
      userId: req.userId,
    });
    res.status(200).send(hotel);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

export const fetchMyHotels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req;
    const hotels = await Hotel.find({ userId });
    res.json(hotels);
  } catch (err) {
    return next(err);
  }
};

export const addHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    let newHotel = req.body;
    const lastUpdated = new Date();
    const userId = req.userId;

    const imageUrl = await uploadImages(imageFiles);
    newHotel = {
      ...newHotel,
      imageUrl,
      lastUpdated,
      userId,
    };

    const hotel = new Hotel(newHotel);
    await hotel.save();
    res.status(201).send(hotel);
  } catch (err: any) {
    next(err);
  }
};

export const updateHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let updatedHotel: HotelType = { ...req.body };
    updatedHotel.lastUpdated = new Date();
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findByIdAndUpdate(
      {
        _id: hotelId,
        userId: req.userId,
      },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).send({ message: "Hotel not found" });
    }

    const files = req.files as Express.Multer.File[];
    const updatedImageUrls = await uploadImages(files);
    hotel.imageUrl = [...updatedImageUrls, ...(updatedHotel.imageUrl || [])];
    await hotel.save();
    res.status(201).send(hotel);
  } catch (err: any) {
    next(err);
  }
};