
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  onPreviousPage,
  onNextPage,
}: PaginationControlsProps) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('ellipsis');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white/50 backdrop-blur-sm border-t border-slate-200">
      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Itens por página:</span>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results info */}
      <div className="text-sm text-slate-600">
        Mostrando {startIndex} a {endIndex} de {totalItems} resultados
      </div>

      {/* Pagination controls */}
      <Pagination className="w-auto">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className="gap-1 pl-2.5"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
          </PaginationItem>

          {generatePageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="gap-1 pr-2.5"
            >
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
