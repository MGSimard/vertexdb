import { Suspense } from "react";
import { GameHeader } from "@/components/page_game/GameHeader";
import { GameSkeleton } from "@/components/page_game/GameSkeleton";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `VERTEXDB - ${params.slug}`,
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  return (
    <main>
      <Suspense fallback={<GameSkeleton />}>
        <GameHeader slug={slug} />
      </Suspense>
    </main>
  );
}
