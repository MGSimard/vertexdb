import { Searchbar } from "@/components/searchbar/Searchbar";
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
    <main className="index-main">
      <Searchbar />
      <div>
        <h2>THIS APP IS IN ACTIVE DEVELOPMENT MODE.</h2>
      </div>
      <div>
        <h2>DB Test - Wuthering Waves (Game ID: {currentGameId})</h2>
      </div>
      <div>
        <h2>Resources</h2>
        {resources.length > 0 &&
          resources.map((entry) => (
            <ul>
              <li key={entry.rssId}>
                {entry.title}{" "}
                <span>
                  [USER VOTE: {entry.voteAuthor}, {entry.currentUserVote?.toString()}]
                </span>
              </li>
            </ul>
          ))}
      </div>
      <div>
        <h2>Communities</h2>
        {communities.length > 0 &&
          communities.map((entry) => (
            <ul>
              <li key={entry.rssId}>
                {entry.title}{" "}
                <span>
                  [USER VOTE: {entry.voteAuthor}, {entry.currentUserVote?.toString()}]
                </span>
              </li>
            </ul>
          ))}
      </div>
      <div>
        <h2>Content Creators</h2>
        {contentCreators.length > 0 &&
          contentCreators.map((entry) => (
            <ul>
              <li key={entry.rssId}>
                {entry.title}{" "}
                <span>
                  [USER VOTE: {entry.voteAuthor}, {entry.currentUserVote?.toString()}]
                </span>
              </li>
            </ul>
          ))}
      </div>
    </main>
  );
}
