import { useState } from "react";
import { useSearchContext } from "../contexts/useAllContext";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacility,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars(
      prevStars =>
        event.target.checked // IF
          ? [...prevStars, starRating] // checked add check to prevSTAR array
          : prevStars.filter(star => star !== starRating) // unchecked filter uncheck from prevSTAR array
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelTypes = event.target.value;

    setSelectedHotelTypes(
      prevHotelTypes =>
        event.target.checked // IF
          ? [...prevHotelTypes, hotelTypes] // checked add check to prevHotelTypes array
          : prevHotelTypes.filter(type => type !== hotelTypes) // unchecked filter uncheck from prevHotelTypes array
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;

    setSelectedFacility(
      prevFacility =>
        event.target.checked // IF
          ? [...prevFacility, facility] // checked add check to prevFacility array
          : prevFacility.filter(item => item !== facility) // unchecked filter uncheck from prevFacility array
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacility={selectedFacility}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number | undefined) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.meta.total} Hotel found
            {search.destination ? `in ${search.destination}` : ""}
          </span>
          {/* Sort Start */}
          {/* Sort Start */}
          {/* Sort Start */}
          <select
            value={sortOption}
            className="p-2 border rounded-md"
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">Price Per Night (low-high)</option>
            <option value="pricePerNightDesc">
              Price Per Night (high-low)
            </option>
          </select>
          {/* Sort End */}
          {/* Sort End */}
          {/* Sort End */}
        </div>
        {hotelData?.data.map(hotel => (
          <SearchResultCard key={hotel._id} hotel={hotel} />
        ))}
        <div>
          <Pagination
            page={hotelData?.meta.page || 1}
            pages={hotelData?.meta.pages || 1}
            onPageChange={page => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
