import { getInitialRss, getGameData } from "@/server/actions";
import { LinkButton } from "@/components/page_game/LinkButton";
import { Card } from "@/components/page_game/Card";
import { Globe, Discord, Steam } from "@/components/icons";
import { convertUnix, coverPath } from "@/utils/helpers";
import { GamedataResponseTypes, SubmissionTypes } from "@/utils/types";

export async function GameHeader({ slug }: { slug: string }) {
  const currentUser = "TESTUSER";
  const gameData = (await getGameData(slug)) as GamedataResponseTypes;
  const initialRss = (await getInitialRss(gameData?.id, currentUser)) as SubmissionTypes[];

  // if (gameData?.websites && gameData.websites.length > 0) {
  //   console.log("WEBSITES:", gameData.websites);
  // }

  const sections = ["Resources", "Communities", "Creators"];

  return (
    <>
      <section className="gamesection-header">
        <div
          className="game-background"
          style={{
            backgroundImage: `url(${gameData?.cover?.image_id ? coverPath("720p", gameData.cover.image_id) : ""})`,
          }}></div>
        <div className="game-image-container">
          <div className="gic-inner">
            <div className="gic-left"></div>
            <div
              className="gic-middle"
              style={{
                backgroundImage: `url(${
                  gameData?.cover?.image_id ? coverPath("720p", gameData.cover.image_id) : "/missingasset.webp"
                })`,
              }}></div>
            <div className="gic-right"></div>
          </div>
        </div>
        <div className="game-metadata">
          <div className="game-table">
            <h1>{gameData?.name ? gameData.name : "GAME NOT FOUND"}</h1>
            <table className="table-vertical">
              <tbody>
                <tr>
                  <th>RELEASE DATE:</th>
                  <td>{gameData?.first_release_date ? convertUnix(gameData.first_release_date) : "-"}</td>
                </tr>
                <tr>
                  <th>DEVELOPER:</th>
                  <td>
                    {gameData?.involved_companies
                      ? gameData?.involved_companies
                          ?.filter((company) => company.developer === true)
                          .map((company) => company.company.name)
                          .join(", ")
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <th>PUBLISHER:</th>
                  <td>
                    {gameData?.involved_companies
                      ? gameData?.involved_companies
                          ?.filter((company) => company.publisher === true)
                          .map((company) => company.company.name)
                          .join(", ")
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="game-officialrss">
            <LinkButton category={1} icon={<Globe />} text="WEBSITE" gameData={gameData} />
            <LinkButton category={13} icon={<Steam />} text="STEAM" gameData={gameData} />
            <LinkButton category={18} icon={<Discord />} text="DISCORD" gameData={gameData} />
          </div>
        </div>
      </section>

      <section className="game-resources">
        {sections.map((section) => (
          <div key={section} className="rss-wrapper">
            <h2>{section}</h2>
            <Card
              gameId={gameData.id}
              slug={slug}
              section={section.toLowerCase()}
              content={initialRss.filter((entry) => entry.section === section.toLowerCase()) ?? []}
            />
          </div>
        ))}
      </section>
    </>
  );
}
