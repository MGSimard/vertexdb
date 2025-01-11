import { Suspense } from "react";
import { GameHeader } from "@/components/page_game/GameHeader";
import { GameSkeleton } from "@/components/page_game/GameSkeleton";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `VERTEXDB - ${params.slug}`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  return (
    <main>
      <Suspense fallback={<GameSkeleton />}>
        <GameHeader slug={slug} />
      </Suspense>
    </main>
  );
}
