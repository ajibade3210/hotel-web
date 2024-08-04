import { Link } from "react-router-dom";
import { HotelType } from "../config/hotel-options-config";
import { AiFillStar } from "react-icons/ai";

type Props = {
  hotel: HotelType;
};

const SearchResultCard = ({ hotel }: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      <div className="w-full h-[300px]">
        <img
          className="w-full h-full object-cover object-center"
          src={hotel.imageUrl[0]}
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        <div>
          <Link
            to={`/detail/${hotel._id}`}
            className="text-2xl font-bold cursor-pointer"
          >
            {hotel.name}
          </Link>
          <div className="flex items-center">
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
            <span className="ml-1 text-sm">{hotel.type}</span>
          </div>
        </div>
        <div>
          <div className="line-clamp-4">{hotel.description}</div>
        </div>

        <div className="grid grid-cols-2 items-end whitespace-nowrap">
          <div className="flex gap-1 item-center font-bold">
            {hotel.facilities.slice(0, 2).map(facility => (
              <span
                key={facility}
                className="bg-slate-300 p-2 rounded-lg text-xs whitespace-nowrap"
              >
                {facility}
              </span>
            ))}
            <span className="test-xs">
              {hotel.facilities.length > 2 &&
                `+${hotel.facilities.length - 2} more`}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-bold text-sm text-purple-600">
              ${hotel.pricePerNight} per night
            </span>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-blue-600 rounded text-white h-full p-2 font-bold text-xs max-w-fit hover:bg-blue-500"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
