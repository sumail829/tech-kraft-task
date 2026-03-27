"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter values from URL
  const [priceMin, setPriceMin] = useState(searchParams.get("price_min") || "");
  const [beds, setBeds] = useState(searchParams.get("beds") || "");
  const [isPending, startTransition] = useTransition();

  const applyFilters = () => {
    startTransition(() => {
      const query = new URLSearchParams(searchParams.toString());
      if (priceMin) query.set("price_min", priceMin);
      else query.delete("price_min");

      if (beds) query.set("beds", beds);
      else query.delete("beds");

      query.delete("page"); // reset to first page on filter change
      router.push(`/listings?${query.toString()}`);
    });
  };

  return (
    <div className="flex gap-4 mb-4 flex-wrap items-end">
      <div>
        <label className="block text-sm font-medium mb-1">Min Price</label>
        <input
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="border rounded px-2 py-1 w-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Beds</label>
        <input
          type="number"
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
          className="border rounded px-2 py-1 w-20"
        />
      </div>

      <button
        onClick={applyFilters}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Apply
      </button>
    </div>
  );
}