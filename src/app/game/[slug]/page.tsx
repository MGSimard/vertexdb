"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { GamedataResponseTypes } from "@/utils/types";
import { GameSkeleton } from "@/components/page_game/GameSkeleton";
import { Card } from "@/components/Card";
import { Globe, Discord } from "@/components/icons";
import { coverPath } from "@/utils/coverPath";
import { convertUnix } from "@/utils/convertUnix";

interface LinkButtonTypes {
  category: number;
  icon: React.ReactNode | undefined;
  text: string;
}

interface StateTypes {
  isPending: boolean;
  error: string | null;
  data: GamedataResponseTypes | null;
}

export default function Page() {
  const { slug } = useParams();

  const [{ isPending, error, data: gameData }, setFetchResult] = useState<StateTypes>({
    isPending: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let ignore = false;
    setFetchResult({ isPending: true, error: null, data: null });

    const fetchGameData = async () => {
      try {
        const res = await fetch(`/api/gamedata?query=${slug as string}`);

        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();
        if (!ignore) setFetchResult({ isPending: false, error: null, data: data[0] });
      } catch (err: any) {
        console.log(err);
        setFetchResult({ isPending: false, error: err.message, data: null });
      }
    };

    fetchGameData();

    return () => {
      ignore = true;
      setFetchResult({ isPending: true, error: null, data: null });
    };
  }, []);

  console.log(gameData);

  const doCover = () => {
    return gameData?.cover?.image_id ? coverPath("720p", gameData.cover.image_id) : "/missingasset.webp";
  };
  const doStrip = () => {
    return gameData?.cover?.image_id ? coverPath("720p", gameData.cover.image_id) : "";
  };

  if (gameData?.websites && gameData.websites.length > 0) {
    console.log(gameData.websites);
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

  return (
    <main>
      {isPending ? (
        <GameSkeleton />
      ) : (
        <>
          <section className="gamesection-header">
            <div className="game-background" style={{ backgroundImage: `url(${doStrip()})` }}></div>
            <div className="game-image-container">
              <div className="gic-inner">
                <div className="gic-left"></div>
                <div className="gic-middle" style={{ backgroundImage: `url(${doCover()})` }}></div>
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
            {gameData?.websites && gameData.websites.length > 0 && (
              <ul>
                {gameData.websites.map((website) => (
                  <li key={website.id}>
                    <a href={website.url} target="_blank" className="linkdeco">
                      <small>{website.url}</small>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
