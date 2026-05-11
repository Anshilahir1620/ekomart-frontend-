import ProductDetail from "./ProductDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProductDetail id={resolvedParams.id} />;
}
