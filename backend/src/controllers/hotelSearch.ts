import { NextFunction, Request, Response } from "express";
import Hotel from "../models/Hotel";
import { HotelSearchResponse } from "../services/globalTypes";

export const hotelSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1 } = req.query;
    const pageSize = 5;
    const pageNumber = parseInt(page.toString());

    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find().skip(skip).limit(pageSize);

    const total = await Hotel.countDocuments();

    const response: HotelSearchResponse = {
      data: hotels,
      meta: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.status(201).send(response);
  } catch (err: any) {
    next(err);
  }
};
