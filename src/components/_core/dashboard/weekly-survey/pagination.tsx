"use client";

import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-6 flex items-center justify-end gap-2 font-sora text-sm">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-1 px-2 py-1 text-[#94A3B8] disabled:opacity-50"
      >
        ← Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`flex h-7 w-7 items-center justify-center rounded-md ${
            p === page ? "bg-[#E8EFF1] text-[#092A31]" : "text-[#94A3B8]"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-1 px-2 py-1 text-[#94A3B8] disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;