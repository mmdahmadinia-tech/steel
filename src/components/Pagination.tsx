import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  showPageSize = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // محاسبه صفحات قابل نمایش
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // همه صفحات
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // صفحات با ellipsis
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-t">
      {/* اطلاعات */}
      <div className="text-sm text-gray-600">
        نمایش <span className="font-bold text-blue-600">{startItem}</span> تا{' '}
        <span className="font-bold text-blue-600">{endItem}</span> از{' '}
        <span className="font-bold text-blue-600">{totalItems}</span> مورد
      </div>

      {/* دکمه‌های pagination */}
      <div className="flex items-center gap-2">
        {/* دکمه قبلی */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← قبلی
        </button>

        {/* شماره صفحات */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* دکمه بعدی */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          بعدی →
        </button>
      </div>
    </div>
  );
}
