import HomeClient from "./HomeClient";
import { getPublicProducts } from "@/lib/products";

export default async function Home() {
  const { products, error } = await getPublicProducts();

  return <HomeClient products={products} error={error} />;
}
