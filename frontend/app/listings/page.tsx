import ListingsView from "@/components/ListingsView";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  return <ListingsView searchParams={params} />;
}