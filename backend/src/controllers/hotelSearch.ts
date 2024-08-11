import { NextFunction, Request, Response } from "express";
import Hotel from "../models/Hotel";
import {
  BookingType,
  HotelSearchResponse,
  PaymentIntentResponse,
} from "../services/globalTypes";
import { constructSearchQuery, createPaymentIntent, payStackPayment, sortOptions, stripePayment } from "../services/helper";


export const getHotelDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id.toString();
    const hotel = await Hotel.findById(id);
    return res.json(hotel);
  } catch (err: any) {
    return next(err);
  }
};

export const getAllHotels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    return res.json(hotels);
  } catch (err: any) {
    return next(err);
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
    return res.status(201).send(response);
  } catch (err: any) {
    return next(err);
  }
};

export const payment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // totalCost, userId, HotelId
    const { numberOfNights, type } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    let response = {
      paymentIntentId: "nil",
      clientSecret: "nil",
      totalCost,
    };

    if (type === "stripe") {
      const paymentIntent = await createPaymentIntent({
        amount: totalCost * 100, // cents
        currency: "usd",
        metadata: {
          hotelId,
          userId: req.userId,
        },
      });

      if (!paymentIntent.client_secret) {
        return res
          .status(500)
          .json({ message: "Error creating payment intent" });
      }

      response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
      };
    }
    return res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};

export const bookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req.body;
    const paymentIntentId = request.paymentIntentId;

    if (req.body.type === "stripe") {
      const paymentIntent = await stripePayment(paymentIntentId);

      if (!paymentIntent) {
        return res.status(500).json({ message: "Payment intent not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }
    } else {
      const paymentIntent = await payStackPayment(paymentIntentId);

      if (!paymentIntent.data.status) {
        return res.status(500).json({ message: "Payment reference not found" });
      }
    }

    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId,
    };
    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId },
      { $push: { bookings: newBooking } },
      { new: true, useFindAndModify: false }
    );

    if (!hotel) {
      return res.status(400).json({ message: "hotel not found" });
    }
    await hotel.save();
    return res.status(200).json(hotel);
  } catch (err) {
    return next(err);
  }
};
