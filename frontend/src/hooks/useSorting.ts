
import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface UseSortingProps<T> {
  data: T[];
  defaultSort?: SortConfig;
}

export function useSorting<T>({ data, defaultSort }: UseSortingProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    defaultSort || { key: '', direction: null }
  );

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        // Cycling through: asc -> desc -> null
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: '', direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  };

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
}
