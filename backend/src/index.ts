// import helmet from "helmet";
// import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/Users";
import authRoutes from "./routes/Auth";
import myHotelRoutes from "./routes/Hotels";
import hotelSearch from "./routes/HotelSearch";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_CONNECTION_STRING = process.env
  .MONGODB_CONNECTION_STRING as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

if (!MONGODB_CONNECTION_STRING) {
  throw new Error("Missing MONGODB_CONNECTION_STRING in environment variables");
}

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
mongoose
  .connect(MONGODB_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelSearch);

app.get("*", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.get(
  "/api/test",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ message: "hello world!" });
    } catch (error) {
      next(error);
    }
  }
);

// Global error handler
app.use((err: Error, req: Request, res: Response) => {
  console.log("Error Handler -- ");
  console.error(err);
  console.log("err.message : ", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
