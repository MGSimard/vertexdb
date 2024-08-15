"use server";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/server/db";
import { gameRssEntries, gameRssVotes } from "@/server/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const submissionSchema = z.object({
  rssId: z.number().int().positive().lte(2147483647), // Ignore, DB auto
  gameId: z.coerce.number().int().positive().lte(2147483647),
  title: z.string().trim().min(1).max(255),
  url: z.string().url().trim().min(1).max(255),
  description: z.string().trim().min(1).max(255),
  /* DB takes any string, set enum for limited dead DB entries if user fucks with hidden form field */
  section: z.enum(["resources", "communities", "creators"], { invalid_type_error: "Invalid Section." }),
  slug: z.string().max(1024), // Only for page refresh, no use in DB
  score: z.number(), // Ignore, DB auto
  createdAt: z.date(), // Ignore, DB auto
  updatedAt: z.date(), // Ignore, DB auto
});
const CreateSubmission = submissionSchema.omit({ rssId: true, score: true, createdAt: true, updatedAt: true });

// vote stuff for later
// const voteSchema = z.object({
//   voteId: z.number().int().positive().lte(2147483647),
//   rssId: z.coerce.number().int().positive().lte(2147483647),
//   voterId: z.string().max(255),
//   voteType: z.boolean(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });
// const CreateVote = voteSchema.omit({ voteId: true, createdAt: true, updatedAt: true });

export async function createSubmission(prevState: any, formData: FormData) {
  const user = auth();

  if (!user.userId) throw new Error("Submission Failed: Unauthorized");

  const validated = CreateSubmission.safeParse({
    gameId: formData.get("gameId"),
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description"),
    section: formData.get("section"),
    slug: formData.get("slug"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: "Invalid Fields. Failed to Create Submission." };
  }

  const { gameId, title, url, description, section, slug } = validated.data;
  const author = user.userId;

  try {
    await db
      .insert(gameRssEntries)
      .values({ gameId: gameId, author: author, title: title, url: url, description: description, section: section });
  } catch (err) {
    return { message: "Database Error: Failed to Create Submission." };
  }

  revalidatePath(`/game/${slug}`);
  redirect(`/game/${slug}`);
}

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
