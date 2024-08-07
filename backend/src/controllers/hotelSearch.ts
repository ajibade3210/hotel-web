import { NextFunction, Request, Response } from "express";
import Hotel from "../models/Hotel";
import {
  BookingType,
  HotelSearchResponse,
  PaymentIntentResponse,
} from "../services/globalTypes";
import { constructSearchQuery, sortOptions } from "../services/helper";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

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

export const payment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // totalCost, userId, HotelId

    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100, // cents
      currency: "usd",
      metadata: {
        hotelId,
        userId: req.userId,
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    return res.status(200).json(response);
  } catch (err) {
    next(err);
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

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId as string
    );

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

    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId,
    };
    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId },
      { $push: { bookings: newBooking } }
    );

    if (!hotel) {
      return res.status(400).json({ message: "hotel not found" });
    }
    await hotel.save();
    return res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
