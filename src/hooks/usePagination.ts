import { useState, useMemo, useCallback, useEffect } from 'react';

interface PaginationOptions<T> {
  data: T[];
  initialPage?: number;
  pageSize?: number;
  filters?: Record<string, any>;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
}

export function usePagination<T>({
  data,
  initialPage = 1,
  pageSize = 50,
  filters = {},
  sortBy,
  sortOrder = 'asc',
}: PaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFields, setSearchFields] = useState<(keyof T)[]>([]);

  // اعمال فیلترها
  const filteredData = useMemo(() => {
    let result = [...data];

    // فیلترهای عمومی
    if (Object.keys(filters).length > 0) {
      result = result.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === '' || value === null) return true;
          const itemValue = (item as any)[key];
          
          if (typeof itemValue === 'string' && typeof value === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          
          if (typeof itemValue === 'number' && typeof value === 'number') {
            return itemValue === value;
          }
          
          return itemValue === value;
        });
      });
    }

    // جستجو
    if (searchQuery && searchFields.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = (item as any)[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          if (typeof value === 'number') {
            return value.toString().includes(query);
          }
          return false;
        });
      });
    }

    return result;
  }, [data, filters, searchQuery, searchFields]);

  // مرتب‌سازی
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredData, sortBy, sortOrder]);

  // محاسبه pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // تغییر صفحه
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // ریست به صفحه اول وقتی فیلترها تغییر می‌کنند
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  return {
    data: paginatedData,
    allData: sortedData,
    currentPage,
    totalPages,
    totalItems: sortedData.length,
    pageSize,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    setSearchQuery,
    setSearchFields,
    searchQuery,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

// Hook برای debounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook برای virtualization ساده
export function useVirtualScroll(itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 5,
    Infinity
  );

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    startIndex,
    endIndex,
    handleScroll,
    totalHeight: 0, // باید از بیرون تنظیم شود
    offsetY: startIndex * itemHeight,
  };
}

// Hook برای memory management
export function useMemoryOptimization() {
  useEffect(() => {
    // پاک کردن cache وقتی tab غیرفعال می‌شود
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // می‌توان اینجا garbage collection را trigger کرد
        if ('gc' in window) {
          (window as any).gc();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
