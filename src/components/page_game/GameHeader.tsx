"use client";
import { useParams } from "next/navigation";
import { useGameData } from "@/utils/hooks/useGameData";
import type { GamedataResponseTypes } from "@/utils/types";
import { Globe, Discord } from "@/components/icons";
import { convertUnix, coverPath } from "@/utils/helpers";
import { GameSkeleton } from "./GameSkeleton";

interface LinkButtonTypes {
  category: number;
  icon: React.ReactNode | undefined;
  text: string;
}

export function GameHeader() {
  const { slug } = useParams();

  console.log(slug);
  const { isPending, error, gameData } = useGameData(slug as string);

  if (gameData) console.log(gameData[0]);
  if (error) console.log(error);

  if (gameData?.websites && gameData.websites.length > 0) {
    console.log("WEBSITES:", gameData.websites);
  }

  const LinkButton = ({ category, icon, text }: LinkButtonTypes) => {
    const website = gameData?.websites?.find((site) => site.category === category)?.url;
    return (
      <a
        href={website}
        target="_blank"
        aria-disabled={!website}
        className={`button-styled-a${website ? "" : " disabled"}`}>
        {icon}
        <span>{text}</span>
      </a>
    );
  };

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
          <LinkButton category={1} icon={<Globe />} text="WEBSITE" />
          <LinkButton category={13} icon={undefined} text="STEAM" />
          <LinkButton category={18} icon={<Discord />} text="DISCORD" />
        </div>
      </div>
    </section>
  );
}
