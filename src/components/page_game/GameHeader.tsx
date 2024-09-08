import { getInitialRss, getGameData } from "@/server/actions";
import { convertUnix, coverPath } from "@/utils/helpers";
import { sectionEnums } from "@/utils/enums";
import { RssList } from "@/components/page_game/RssList";
import { LinkButton } from "@/components/page_game/LinkButton";
import { Globe, Discord, Steam } from "@/components/icons";

export async function GameHeader({ slug }: { slug: string }) {
  const { success, data: gameData } = await getGameData(slug);

  const initialRss = await getInitialRss(gameData?.id);

  const developers = gameData?.involved_companies?.filter((company) => company.developer === true);
  const publishers = gameData?.involved_companies?.filter((company) => company.publisher === true);

  // if (gameData?.websites && gameData.websites.length > 0) {
  //   console.log("WEBSITES:", gameData.websites);
  // }
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
                  <td>{developers?.length ? developers.map((company) => company.company.name).join(", ") : "-"}</td>
                </tr>
                <tr>
                  <th>PUBLISHER:</th>
                  <td>{publishers?.length ? publishers.map((company) => company.company.name).join(", ") : "-"}</td>
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

      {success && (
        <section className="game-resources">
          {sectionEnums.map((section) => (
            <div key={section} className="rss-container">
              <h2>{section}</h2>
              {!initialRss.success ? (
                initialRss.message
              ) : (
                <RssList
                  gameId={gameData!.id}
                  slug={slug}
                  section={section.toLowerCase()}
                  content={initialRss.data!.filter((entry) => entry.section === section.toLowerCase()) ?? []}
                />
              )}
            </div>
          ))}
        </section>
      )}
    </>
  );
}
