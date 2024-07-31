import { Searchbar } from "@/components/searchbar/Searchbar";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { gameRssEntries } from "@/server/db/schema";

export default async function Page() {
  const currentGameId = 202956;

  const test = await db.query.gameRssEntries.findMany({
    where: eq(gameRssEntries.gameId, currentGameId),
  });

  console.log(test);

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
        <ul>
          <li>Test</li>
        </ul>
      </div>
      <div>
        <h2>Communities</h2>
        <ul>
          <li>Test</li>
        </ul>
      </div>
      <div>
        <h2>Content Creators</h2>
        <ul>
          <li>Test</li>
        </ul>
      </div>
    </main>
  );
}
