"use server";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/server/db";
import { gameRssEntries, gameRssVotes } from "@/server/db/schema";

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

    return data;
  } catch (err) {
    return err;
  }
}

// CONTENT FETCHER (FOR GAME PAGE)
export async function getGameData(query: string) {
  try {
    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.CLIENT_ID,
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      } as HeadersInit,
      body: `fields name, cover.image_id, first_release_date, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, summary, websites.category, websites.url; where slug = "${query}" & version_parent = null & category = (0,4,8,9,12);`,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();

    return data[0];
  } catch (err) {
    console.log(err);
  }
}
