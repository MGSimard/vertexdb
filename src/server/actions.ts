"use server";
import { db } from "@/server/db";
import { gameRssEntries, gameRssVotes } from "./db/schema";
import { eq, and, desc } from "drizzle-orm";

// GRAB ALL SUBMITTED RESOURCES FOR A GAME
// AND THE CURRENT USER'S VOTE ON THEM IF THEY VOTED (RETURN TRUE, FALSE, NULL)
export async function getInitialRss(currentGameId: number, currentUser: string) {
  try {
    const data = await db
      .select({
        rssId: gameRssEntries.rssId,
        author: gameRssEntries.author,
        title: gameRssEntries.title,
        url: gameRssEntries.url,
        description: gameRssEntries.description,
        section: gameRssEntries.section,
        score: gameRssEntries.score,
        currentUserVote: gameRssVotes.voteType,
      })
      .from(gameRssEntries)
      .leftJoin(gameRssVotes, and(eq(gameRssEntries.rssId, gameRssVotes.rssId), eq(gameRssVotes.voterId, currentUser)))
      .where(eq(gameRssEntries.gameId, currentGameId))
      .orderBy(desc(gameRssEntries.score));

    return { data };
  } catch (err) {
    return { err };
  }
}
