export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";
export const SET_FILTERS = "SET_FILTERS";

export const toggleFavorite = (id: any) => {
  return { type: TOGGLE_FAVORITE, eventId: id };
};

export const setFilters = (filterSettings: any) => {
  return { type: SET_FILTERS, filters: filterSettings };
};
