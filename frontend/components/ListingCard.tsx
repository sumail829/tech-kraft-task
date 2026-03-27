import Link from "next/link";

export default function ListingCard({ listing }: any) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="border p-4 cursor-pointer">
        <h2>{listing.title}</h2>
        <p>{listing.price}</p>
      </div>
    </Link>
  );
}