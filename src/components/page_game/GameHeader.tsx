import { GameSkeleton } from "./GameSkeleton";
import { LinkButton } from "@/components/page_game/LinkButton";
import { Globe, Discord, Steam } from "@/components/icons";
import { convertUnix, coverPath } from "@/utils/helpers";

export function GameHeader(slug: string) {
  if (gameData?.websites && gameData.websites.length > 0) {
    console.log("WEBSITES:", gameData.websites);
  }

  if (isPending) return <GameSkeleton />;

  return (
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
  );
}
