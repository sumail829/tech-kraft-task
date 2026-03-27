import { api } from "@/lib/api";

async function getListings() {
  const res = await fetch("http://localhost:5000/listings", {
    cache: "no-store",
  });

  return res.json();
}

export default async function ListingsView() {
  const data = await getListings();
console.log(data,"this is data")
  const listings = data.data || data;

  return (
    <div>
      <h1>Listings</h1>

      {listings.map((listing: any) => (
        <div key={listing.id}>
          <h2>{listing.title}</h2>
          <p>{listing.price}</p>
        </div>
      ))}
    </div>
  );
}