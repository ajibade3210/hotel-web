import { useContext } from "react";
import { AppContext, AppContextType } from "./AppContext";
import { SearchContext, SearchContextType } from "./SearchContext";

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContextType;
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context as SearchContextType;
};
