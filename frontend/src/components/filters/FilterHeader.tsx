
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw } from "lucide-react";

interface FilterHeaderProps {
  activeFiltersCount: number;
  onClearAllFilters: () => void;
}

const FilterHeader = ({ activeFiltersCount, onClearAllFilters }: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-blue-600" />
        <span className="text-lg font-semibold text-gray-900">Filtros</span>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {activeFiltersCount}
          </Badge>
        )}
      </div>
      
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAllFilters}
          className="text-gray-500 hover:text-gray-700 h-8 px-2"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  );
};

export default FilterHeader;
