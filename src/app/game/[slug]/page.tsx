import { GameHeader } from "@/components/page_game/GameHeader";
import { Card } from "@/components/Card";
import { getInitialRss } from "@/server/actions";

export default async function Page() {
  const currentGameId = 202956;
  const currentUser = "TESTUSER5";

  const initialRss = await getInitialRss(currentGameId, currentUser);
  console.log(initialRss);

  // const resources = initialRssRender.filter((entry) => entry.section === "resources");
  // const communities = initialRssRender.filter((entry) => entry.section === "communities");
  // const contentCreators = initialRssRender.filter((entry) => entry.section === "contentCreators");
  // console.log("COMMUNITIES:", resources);
  // console.log("RESOURCES:", communities);
  // console.log("CONTENT CREATORS:", contentCreators);
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
