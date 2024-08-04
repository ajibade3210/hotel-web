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
          <h2 className="text-2xl font-bold cursor-pointer">{hotel.name}</h2>
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
      </div>
    </div>
  );
};

export default SearchResultCard;
