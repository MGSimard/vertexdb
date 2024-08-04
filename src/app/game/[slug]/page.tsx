import { Suspense } from "react";
import { GameHeader } from "@/components/page_game/GameHeader";
import { GameSkeleton } from "@/components/page_game/GameSkeleton";

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  return (
    <main>
      <Suspense fallback={<GameSkeleton />}>
        <GameHeader slug={slug} />
      </Suspense>

      {/* Bring back full link list in small later */}
    </main>
  );
}
