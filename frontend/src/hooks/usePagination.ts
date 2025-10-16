
import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
}

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  currentData: T[];
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setItemsPerPage: (items: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export function usePagination<T>({ data, itemsPerPage = 10 }: UsePaginationProps<T>): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPageState);
  
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPageState;
    const endIndex = startIndex + itemsPerPageState;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPageState]);

  const startIndex = (currentPage - 1) * itemsPerPageState + 1;
  const endIndex = Math.min(currentPage * itemsPerPageState, data.length);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const setItemsPerPage = (items: number) => {
    setItemsPerPageState(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage: itemsPerPageState,
    currentData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setItemsPerPage,
    startIndex,
    endIndex,
    totalItems: data.length,
  };
}
