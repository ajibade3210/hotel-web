import { NextFunction, Request, Response } from "express";
import Hotel from "../models/Hotel";
import { HotelType } from "../services/globalTypes";

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map(hotel => {
      const userBookings = hotel.bookings.filter(
        booking => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });
   return res.status(200).send(results);
  } catch (err: any) {
    return next(err);
  }
};
