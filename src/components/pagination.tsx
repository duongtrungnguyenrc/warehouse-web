"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FC } from "react";

import { cn } from "@/lib";

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onChangePage: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({ currentPage = 0, pageCount = 1, onChangePage }) => {
  const getDisplayPages = (): number[] => {
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    let from: number;
    let to: number;

    if (currentPage <= 2) {
      from = 0;
      to = 4;
    } else if (currentPage >= pageCount - 3) {
      from = pageCount - 5;
      to = pageCount - 1;
    } else {
      from = currentPage - 2;
      to = currentPage + 2;
    }

    from = Math.max(0, from);
    to = Math.min(pageCount - 1, to);

    return Array.from({ length: to - from + 1 }, (_, i) => i + from);
  };

  const displayPages = getDisplayPages();
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pageCount - 1;

  return (
    <nav className="w-full flex justify-center" aria-label="Pagination">
      <ul className="flex items-center gap-1 flex-wrap">
        {!isFirstPage && (
          <li>
            <button onClick={() => onChangePage(0)} className="h-8 px-3 border text-xs rounded-md bg-white hover:bg-black hover:text-white transition-all">
              First page
            </button>
          </li>
        )}

        <li>
          <button
            disabled={isFirstPage}
            onClick={() => onChangePage(currentPage - 1)}
            className={cn(
              "h-8 w-8 flex items-center justify-center rounded-md border transition-all",
              isFirstPage ? "bg-muted text-muted-foreground cursor-not-allowed" : "hover:bg-black hover:text-white bg-white",
            )}
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {displayPages.map((page) => (
          <li key={page}>
            <button
              onClick={() => onChangePage(page)}
              className={cn(
                "h-8 w-8 flex items-center justify-center border text-xs rounded-md transition-all",
                page === currentPage ? "bg-black text-white" : "bg-white hover:bg-muted",
              )}
            >
              {page + 1}
            </button>
          </li>
        ))}

        {!isLastPage && !displayPages.includes(pageCount - 1) && (
          <li>
            <button onClick={() => onChangePage(pageCount - 1)} className="h-8 px-3 text-xs border rounded-md bg-white hover:bg-black hover:text-white transition-all">
              Last page
            </button>
          </li>
        )}

        <li>
          <button
            disabled={isLastPage}
            onClick={() => onChangePage(currentPage + 1)}
            className={cn(
              "h-8 w-8 flex items-center justify-center border rounded-md transition-all",
              isLastPage ? "bg-muted text-muted-foreground cursor-not-allowed" : "hover:bg-black hover:text-white bg-white",
            )}
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
