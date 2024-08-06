export const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  // $all -- must have all selected
  // $in -- must have at least one of the selected
  // $gte
  // $lte

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    constructedQuery.starRating = {
      $in: Array.isArray(queryParams.stars)
        ? queryParams.stars
        : [queryParams.stars],
    };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  if (queryParams.minPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.minPrice).toString(),
    };
  }

  return constructedQuery;
};

export const sortOptions = (queryParams: any) => {
  let sortOption: any = {};

  switch (queryParams.sortOption) {
    case "starRating":
      sortOption = { starRating: -1 };
      break;
    case "pricePerNightAsc":
      sortOption = { pricePerNight: 1 };
      break;
    case "pricePerNightDesc":
      sortOption = { pricePerNight: -1 };
      break;
  }
  return sortOption;
};