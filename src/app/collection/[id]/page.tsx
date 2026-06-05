import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LegacyCollectionDetail({ params }: PageProps) {
  const { id } = await params;
  redirect(`/collections/${id}`);
}
