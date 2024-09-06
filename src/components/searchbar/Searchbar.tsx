"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { SearchResponseTypes } from "@/types/types";
import { Result } from "@/components/searchbar/Result";
import { Clear, MagnifyingGlass } from "@/components/icons";
import { flatnamed } from "@/utils/helpers";

export function Searchbar() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<SearchResponseTypes[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    const getMatchingGames = async () => {
      try {
        const res = await fetch(`/api/search?query=${query}`);
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }
        const data = await res.json();
        if (!ignore) setGames(data);
      } catch (err) {
        console.error(err);
      }
    };

    const delay = setTimeout(async () => {
      if (query) await getMatchingGames();
      else setGames([]);
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(delay);
    };
  }, [query]);

  // On page change, clear search & focus
  useEffect(() => {
    setQuery("");
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  }, [pathname]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") router.push(`/game/${flatnamed(query)}`);
    if (e.key === "Escape" && document.activeElement) (document.activeElement as HTMLElement).blur();
  };
  const clearQuery = () => {
    setQuery("");
  };
  const submitQuery = () => {
    router.push(`/game/${flatnamed(query)}`);
  };

  return (
    <div className={"search-container"}>
      <div className="input-wrap">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={query ? "search-expanded" : ""}
          placeholder="/ / PING VERTEX DATABASE . . ."
          onKeyDown={handleKeyDown}
          spellCheck="false"
          aria-haspopup="listbox"
          autoCorrect="off"
          aria-owns="search-results"
        />
        {query && (
          <div className="search-buttons">
            <button type="button" onClick={clearQuery}>
              <Clear />
            </button>
            <button type="button" onClick={submitQuery}>
              <MagnifyingGlass />
            </button>
          </div>
        )}
      </div>

      {query && (
        <div className="search-results" id="search-results">
          <ul>
            {games.length > 0 && games.map((game) => <Result game={game} key={game.id} />)}
            <li className="search-result">
              <Link href={`/game/${flatnamed(query)}`}>Go to &#x0022;{query}&#x0022; &#8594;</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
