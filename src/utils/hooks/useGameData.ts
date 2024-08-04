"use client";
import { useQuery } from "@tanstack/react-query";
import type { GamedataResponseTypes } from "@/utils/types";

export function useGameData(slug: string) {
  const {
    isPending,
    error,
    data: gameData,
  } = useQuery({
    queryKey: [`gameData-${slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/gamedata?query=${slug as string}`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      return data[0] as GamedataResponseTypes;
    },
    refetchOnWindowFocus: false,
  });

  return { isPending, error, gameData };
}
