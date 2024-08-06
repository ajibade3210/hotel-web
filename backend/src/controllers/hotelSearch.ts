import { NextFunction, Request, Response } from "express";
import Hotel from "../models/Hotel";
import { HotelSearchResponse } from "../services/globalTypes";
import { constructSearchQuery, sortOptions } from "../services/helper";

export const getHotelDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id.toString();
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch (err: any) {
    next(err);
  }
};

export const hotelSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1 } = req.query;
    const pageSize = 5;
    const pageNumber = parseInt(page.toString());
    const query = constructSearchQuery(req.query);
    const sortOption = sortOptions(req.query);

    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

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
