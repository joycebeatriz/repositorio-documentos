
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { SortDirection } from "@/hooks/useSorting";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort: { key: string; direction: SortDirection };
  onSort: (key: string) => void;
  className?: string;
}

const SortableHeader = ({ 
  children, 
  sortKey, 
  currentSort, 
  onSort, 
  className 
}: SortableHeaderProps) => {
  const isActive = currentSort.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  const getSortIcon = () => {
    if (!isActive || direction === null) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (direction === 'asc') {
      return <ChevronUp className="w-4 h-4 text-blue-600" />;
    }
    return <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center gap-2 font-bold text-slate-800 text-xs py-5 tracking-wide hover:text-blue-600 transition-colors group w-full text-left",
        isActive && "text-blue-600",
        className
      )}
      aria-label={`Ordenar por ${children}`}
    >
      <span>{children}</span>
      <span className="group-hover:scale-110 transition-transform">
        {getSortIcon()}
      </span>
    </button>
  );
};

export default SortableHeader;
