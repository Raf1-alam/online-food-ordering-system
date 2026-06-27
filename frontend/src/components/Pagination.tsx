import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  size,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startElement = totalElements === 0 ? 0 : currentPage * size + 1;
  const endElement = Math.min((currentPage + 1) * size, totalElements);

  // Generate page numbers to display
  const pageNumbers: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-dark-border/40">
      {/* Total Text */}
      <p className="text-sm text-slate-400">
        Showing <span className="font-semibold text-white">{startElement}</span> to{' '}
        <span className="font-semibold text-white">{endElement}</span> of{' '}
        <span className="font-semibold text-white">{totalElements}</span> items
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-xl bg-dark-card border border-dark-border text-slate-300 hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none py-1 scrollbar-thin">
          {pageNumbers.map((pNum) => (
            <button
              key={pNum}
              onClick={() => onPageChange(pNum)}
              className={`min-w-[40px] h-10 px-3 rounded-xl font-medium text-sm transition-all border shrink-0 ${
                pNum === currentPage
                  ? 'bg-primary-500 text-white border-primary-500 shadow-[0_0_15px_rgba(255,30,56,0.3)]'
                  : 'bg-dark-card text-slate-300 border-dark-border hover:text-white hover:border-slate-500'
              }`}
            >
              {pNum + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 rounded-xl bg-dark-card border border-dark-border text-slate-300 hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
