import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfo from "../forms/GuestInfoForm/GuestInfo";

const DetailsHotel = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  if (!hotel) {
    return <>No Hotel Yet</>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <span className="flex">
          {Array.from({ length: 5 }).map((_, idx) => (
            <AiFillStar
              key={idx}
              className={
                idx < hotel.starRating ? "fill-yellow-400" : "fill-gray-400"
              }
            />
          ))}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrl.map((image, idx) => (
          <div key={idx} className="h-[300px]">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map(facility => (
          <div
            className="border border-purple-400 rounded-full p-2 text-center"
            key={facility}
          >
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfo pricePerNight={hotel.pricePerNight} hotelId={hotel._id} />
        </div>
      </div>
    </div>
  );
};

export default DetailsHotel;
