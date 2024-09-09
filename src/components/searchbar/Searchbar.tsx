"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getGames } from "@/server/actions";
import type { GameSearchbarTypes } from "@/types/types";
import { Result } from "@/components/searchbar/Result";
import { Clear, MagnifyingGlass } from "@/components/icons";
import { flatnamed } from "@/utils/helpers";
import { CustomToast } from "@/components/layout/CustomToast";
import { toast } from "sonner";

export function Searchbar() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<GameSearchbarTypes[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    if (!query) {
      setGames([]);
      return;
    }

    const searchGames = async () => {
      const { success, data, message } = await getGames(query);
      console.log(message);

      if (!ignore) {
        if (!success) {
          setGames([]);
          toast.custom(() => <CustomToast icon={"warning"} message={message} />);
          console.error(message);
        } else if (data) {
          setGames(data);
        }
      }
    };

    const delay = setTimeout(() => {
      searchGames();
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
