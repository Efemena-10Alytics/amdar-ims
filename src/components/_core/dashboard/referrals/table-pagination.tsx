"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const ELLIPSIS = "ellipsis";
type PageToken = number | typeof ELLIPSIS;

/**
 * At most seven entries: the first and last page always, the current page with
 * one neighbour either side, and an ellipsis across any gap. The referral
 * tables are server-paginated and last_page can be large, so the full run of
 * numbers is never rendered.
 */
function getPageTokens(current: number, last: number): PageToken[] {
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);

  const tokens: PageToken[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  if (start > 2) tokens.push(ELLIPSIS);
  for (let page = start; page <= end; page += 1) tokens.push(page);
  if (end < last - 1) tokens.push(ELLIPSIS);

  tokens.push(last);
  return tokens;
}

export function TablePagination({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}) {
  if (lastPage <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex items-center justify-end gap-1 font-sora text-sm"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[#64748B] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
        Prev
      </button>

      {getPageTokens(currentPage, lastPage).map((token, index) =>
        token === ELLIPSIS ? (
          <span key={`gap-${index}`} className="px-1 text-[#94A3B8]" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={token}
            type="button"
            onClick={() => onPageChange(token)}
            aria-current={token === currentPage ? "page" : undefined}
            className={`flex size-8 items-center justify-center rounded-md ${
              token === currentPage
                ? "bg-[#E8EFF1] font-semibold text-[#092A31]"
                : "text-[#64748B] hover:bg-[#F6F8FA]"
            }`}
          >
            {token}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
        disabled={currentPage >= lastPage}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[#64748B] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
