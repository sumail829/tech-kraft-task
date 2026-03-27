"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({currentPage,totalPages,}: {currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", page.toString());
    router.push(`/listings?${query.toString()}`);
  };

  return (
    <div className="flex gap-2 justify-center mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}