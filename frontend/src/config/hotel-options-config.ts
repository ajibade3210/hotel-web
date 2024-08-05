export const hotelTypes = [
  "Budget",
  "Boutique",
  "Luxury",
  "Ski Resort",
  "Business",
  "Romantic",
  "Family",
  "Hiking Resort",
  "Cabin",
  "Beach Resort",
  "Golf Resort",
  "Motel",
  "All Inclusive",
  "Pet Friendly",
  "Self Catering",
  "Pet Island",
  "Weed Resort",
];

export const hotelFacilities = [
  "Free Wifi",
  "Parking",
  "Airport Shuttle",
  "Family Room",
  "Non-Smoking Rooms",
  "Smoking Rooms",
  "Outdoor Pool",
  "Spa",
  "Fitness Center",
];

// TYPES
export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrl: string[];
  lastUpdated: Date;
};

export type HotelSearchResponse = {
  data: HotelType[];
  meta: {
    total: number;
    page: number;
    pages: number;
  };
};

export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  minPrice?: string;
  sortOption?: string;
};
