import * as React from "react";
import { cn } from "@/lib/utils";

export type PaginationProps = React.ComponentPropsWithoutRef<"nav"> & {
  getPageLabel?: (page: number) => string;
  onPageChange?: (page: number) => void;
  page: number;
  pageCount: number;
  siblingCount?: number;
};

export function Pagination({
  className,
  getPageLabel = (page) => String(page),
  onPageChange,
  page,
  pageCount,
  siblingCount = 1,
  ...props
}: PaginationProps) {
  const pages = getVisiblePages(page, pageCount, siblingCount);

  return (
    <nav aria-label="Pagination" className={cn("ds-pagination", className)} {...props}>
      <PaginationButton disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
        Previous
      </PaginationButton>
      <div className="ds-pagination-pages">
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span aria-hidden="true" className="ds-pagination-ellipsis" key={`ellipsis-${index}`}>
              ...
            </span>
          ) : (
            <PaginationButton
              aria-current={item === page ? "page" : undefined}
              key={item}
              onClick={() => onPageChange?.(item)}
            >
              {getPageLabel(item)}
            </PaginationButton>
          )
        )}
      </div>
      <PaginationButton disabled={page >= pageCount} onClick={() => onPageChange?.(page + 1)}>
        Next
      </PaginationButton>
    </nav>
  );
}

function PaginationButton({ className, type = "button", ...props }: React.ComponentPropsWithoutRef<"button">) {
  return <button className={cn("ds-pagination-button", className)} type={type} {...props} />;
}

function getVisiblePages(page: number, pageCount: number, siblingCount: number) {
  const safePageCount = Math.max(1, pageCount);
  const currentPage = clamp(page, 1, safePageCount);
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(safePageCount - 1, currentPage + siblingCount);
  const items: Array<number | "ellipsis"> = [1];

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let item = start; item <= end; item += 1) {
    items.push(item);
  }

  if (end < safePageCount - 1) {
    items.push("ellipsis");
  }

  if (safePageCount > 1) {
    items.push(safePageCount);
  }

  return items;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
