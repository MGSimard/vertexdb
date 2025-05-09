import Link from "next/link";
import type { GameSearchbarTypes } from "@/types/types";
import { coverPath } from "@/utils/helpers";

export function Result({ game }: { game: GameSearchbarTypes }) {
  return (
    <li className="search-result">
      <Link href={`/game/${game.slug}`}>
        <div
          className="search-thumb"
          style={{
            backgroundImage: `url(${
              game.cover?.image_id
                ? `${coverPath("cover_small", game.cover.image_id)}`
                : "/assets/placeholder_cover.webp"
            })`,
          }}></div>
        <span>{game.name}</span>
      </Link>
    </li>
  );
}
