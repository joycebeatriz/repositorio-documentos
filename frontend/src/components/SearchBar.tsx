
import { FC, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  onRealTimeSearch?: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ 
  search, 
  setSearch, 
  onRealTimeSearch
}) => {


  // Busca em tempo real com feedback visual
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Aplicar busca imediatamente
    if (onRealTimeSearch) {
      onRealTimeSearch(value);
    }
  }, [setSearch, onRealTimeSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRealTimeSearch) {
      onRealTimeSearch(search);
    }
  };


  const handleClearSearch = () => {
    setSearch("");
    if (onRealTimeSearch) {
      onRealTimeSearch("");
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Pesquisa geral ..."
            value={search}
            onChange={handleInputChange}
            className="h-10 sm:h-12 px-3 sm:px-4 pr-10 text-sm sm:text-base border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-0 focus:outline-none rounded-xl bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button 
          type="submit" 
                      className="h-10 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium text-sm sm:text-base w-full sm:w-auto touch-manipulation active:scale-95"
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </form>

    </div>
  );
};

export default SearchBar;
