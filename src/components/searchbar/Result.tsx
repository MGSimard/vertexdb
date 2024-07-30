import Link from "next/link";
import type { SearchResponseTypes } from "@/utils/types";
import { coverPath } from "@/utils/coverPath";

export function Result({ game }: { game: SearchResponseTypes }) {
  return (
    <li className="search-result">
      <Link href={`/game/${game.slug}`}>
        <div
          className="search-thumb"
          style={{
            backgroundImage: `url(${
              game.cover?.image_id ? `${coverPath("cover_small", game.cover.image_id)}` : "/thumbph.webp"
            })`,
          }}></div>
        <span>{game.name}</span>
      </Link>
    </li>
  );
}
