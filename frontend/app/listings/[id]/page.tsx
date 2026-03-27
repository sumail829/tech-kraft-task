

async function getListing(id: string) {
  const res = await fetch(`http://localhost:5000/listings/${id}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function ListingDetail({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getListing(params.id);

  return (
    <div>
      <h1>{listing.title}</h1>
      <p>{listing.price}</p>
      <p>{listing.suburb}</p>
    </div>
  );
}