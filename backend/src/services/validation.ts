import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
  console.log('req:**** ', req);
  const errors = validationResult(req);
  console.log('errors: ', errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  return next();
};

const addMyHotelValidation = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ];
};

const registerValidation = () => {
  return [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({ min: 6 }),
  ];
};

const loginValidation = () => {
  return [
    check("email", "Email is required").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({
      min: 6,
    }),
  ];
};

export { validate, addMyHotelValidation, registerValidation, loginValidation };
