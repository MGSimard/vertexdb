import { GameHeader } from "@/components/page_game/GameHeader";
import { Card } from "@/components/Card";
import { db } from "@/server/db";
import { gameRssEntries, gameRssVotes } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export default async function Page() {
  const currentGameId = 202956;
  const currentUser = "TESTUSER5";

  // GRAB ALL SUBMITTED RESOURCES FOR A GAME
  // AND THE CURRENT USER'S VOTE ON THEM IF THEY VOTED (RETURN TRUE, FALSE, NULL)
  const initialRssRender = await db
    .select({
      rssId: gameRssEntries.rssId,
      author: gameRssEntries.author,
      title: gameRssEntries.title,
      url: gameRssEntries.url,
      description: gameRssEntries.description,
      section: gameRssEntries.section,
      score: gameRssEntries.score,
      currentUserVote: gameRssVotes.voteType,
      voteAuthor: gameRssVotes.voterId,
    })
    .from(gameRssEntries)
    .leftJoin(gameRssVotes, and(eq(gameRssEntries.rssId, gameRssVotes.rssId), eq(gameRssVotes.voterId, currentUser)))
    .where(eq(gameRssEntries.gameId, currentGameId));

  const resources = initialRssRender.filter((entry) => entry.section === "resources");
  const communities = initialRssRender.filter((entry) => entry.section === "communities");
  const contentCreators = initialRssRender.filter((entry) => entry.section === "contentCreators");
  return (
    <main>
      <GameHeader />
      <section className="game-resourcesection">
        <div>
          <h2>Resources</h2>
          <Card content={[]} />
        </div>
        <div>
          <h2>Communities</h2>
          <Card content={[]} />
        </div>
        <div>
          <h2>Creators</h2>
          <Card content={[]} />
        </div>
      </section>
      <section>
        <h2>Related Links</h2>
        {/* {gameData?.websites && gameData.websites.length > 0 && (
          <ul>
            {gameData.websites.map((website) => (
              <li key={website.id}>
                <a href={website.url} target="_blank" className="linkdeco">
                  <small>{website.url}</small>
                </a>
              </li>
            ))}
          </ul>
        )} */}
      </section>
    </main>
  );
}
