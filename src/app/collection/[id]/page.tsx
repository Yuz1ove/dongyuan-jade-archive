import { notFound } from "next/navigation";
import { collections } from "@/data/jade";
import CollectionDetailClient from "./CollectionDetailClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return collections.map((item) => ({ id: item.id }));
}

export default async function CollectionDetail({ params }: PageProps) {
  const { id } = await params;
  const item = collections.find((entry) => entry.id === id);

  if (!item) {
    notFound();
  }

  return <CollectionDetailClient initialItem={item} />;
}
