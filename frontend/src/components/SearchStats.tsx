
import { FC } from "react";
import { TrendingUp, Clock } from "lucide-react";

interface SearchStatsProps {
  activeFiltersCount: number;
  resultsCount: number;
  searchTime: number;
  searchTerm: string;
}

const SearchStats: FC<SearchStatsProps> = ({ activeFiltersCount, resultsCount, searchTime, searchTerm }) => {
  return null;
};

export default SearchStats;
