import ListingCard from "./ListingCard";
import Filters from "./Filter";
import Pagination from "./Pagination";
import { Listing } from "@/types/listing";

async function getListings(searchParams: Record<string, string>) {
  const query = new URLSearchParams(searchParams).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings?${query}`, {
    cache: "no-store",
  });
  return res.json();
  
}

export default async function ListingsView({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const data = await getListings(searchParams);

  const listings: Listing[] = data.data || [];
  const pagination = data.meta || { page: 1, totalPages: 1 };

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <Filters />

      {listings.length === 0 && <p>No listings found.</p>}

      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  );
}