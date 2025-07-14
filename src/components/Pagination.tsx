"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalPosts,
}: PaginationProps) {
  const pathname = usePathname();
  const postsPerPage = 6;
  const startPost = (currentPage - 1) * postsPerPage + 1;
  const endPost = Math.min(currentPage * postsPerPage, totalPosts);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        end = Math.min(totalPages, 5);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Posts info */}
      <div className="text-sm text-gray-600">
        {totalPosts > 0
          ? `Menampilkan ${startPost}-${endPost} dari ${totalPosts} post`
          : "Tidak ada post tersedia"}
      </div>

      {/* Pagination controls - only show if there are posts */}
      {totalPosts > 0 && (
        <>
          <div className="flex items-center space-x-2">
            {/* Previous button */}
            {currentPage > 1 && (
              <Link
                href={`${pathname}?page=${currentPage - 1}`}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
            )}

            {/* Page numbers */}
            {pageNumbers.map((page) => {
              const isCurrentPage = page === currentPage;
              return (
                <Link
                  key={page}
                  href={`${pathname}?page=${page}`}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isCurrentPage
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {page}
                </Link>
              );
            })}

            {/* Next button */}
            {currentPage < totalPages && (
              <Link
                href={`${pathname}?page=${currentPage + 1}`}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Jump to page */}
          {totalPages > 5 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Lompat ke halaman:</span>
              <div className="flex space-x-1">
                {[1, Math.floor(totalPages / 2), totalPages].map((page) => (
                  <Link
                    key={page}
                    href={`${pathname}?page=${page}`}
                    className={`px-2 py-1 rounded ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
