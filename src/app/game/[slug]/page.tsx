import { GameHeader } from "@/components/page_game/GameHeader";
import { Card } from "@/components/Card";
import { getInitialRss } from "@/server/actions";

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  console.log("PARAMS:", params);
  const currentGameId = 202956;
  const currentUser = "TESTUSER";
  const initialRss = await getInitialRss(currentGameId, currentUser);

  const sections = ["Resources", "Communities", "Creators"];
  return (
    <main>
      <GameHeader slug={slug} />
      <section className="game-resourcesection">
        {sections.map((section) => (
          <div key={section}>
            <h2>{section}</h2>
            <Card content={initialRss.data?.filter((entry) => entry.section === section.toLowerCase()) ?? []} />
          </div>
        ))}
      </section>
      {/* Bring back full link list in small later */}
    </main>
  );
}
