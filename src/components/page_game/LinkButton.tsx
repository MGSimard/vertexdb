import type { GamedataResponseTypes } from "@/types/types";

interface LinkButtonTypes {
  category: number;
  icon: React.ReactNode | undefined;
  text: string;
  gameData: GamedataResponseTypes | undefined;
}

export function LinkButton({ category, icon, text, gameData }: LinkButtonTypes) {
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
}
