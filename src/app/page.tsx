import { Searchbar } from "@/components/searchbar/Searchbar";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { gameRssEntries } from "@/server/db/schema";

export default async function Page() {
  const currentGameId = 202956;

  const submissions = await db.query.gameRssEntries.findMany({
    where: eq(gameRssEntries.gameId, currentGameId),
  });

  const resources = submissions.filter((entry) => entry.section === "resources");
  const communities = submissions.filter((entry) => entry.section === "communities");
  const contentCreators = submissions.filter((entry) => entry.section === "contentCreators");
  console.log(contentCreators);

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
        {resources.length > 0 && resources.map((entry) => <li key={entry.rssId}>{entry.title}</li>)}
      </div>
      <div>
        <h2>Communities</h2>
        {communities.length > 0 && communities.map((entry) => <li key={entry.rssId}>{entry.title}</li>)}
      </div>
      <div>
        <h2>Content Creators</h2>
        {contentCreators.length > 0 && contentCreators.map((entry) => <li key={entry.rssId}>{entry.title}</li>)}
      </div>
    </main>
  );
}
