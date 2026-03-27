"use client";

import { Listing } from "@/types/listing";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="border rounded-md p-4 shadow-sm hover:shadow-md transition w-full bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold">{listing.title}</h2>
      <p className="text-gray-600 dark:text-gray-300">{listing.suburb}</p>
      <p className="mt-1 font-medium text-green-700 dark:text-green-400">
        ${listing.price.toLocaleString()}
      </p>
      <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
        <span>{listing.beds} beds</span>
        <span>{listing.baths} baths</span>
        <span>{listing.propertyType}</span>
      </div>

      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Agent: {listing.agent.name} | {listing.agent.phone}
      </div>
    </div>
  );
}