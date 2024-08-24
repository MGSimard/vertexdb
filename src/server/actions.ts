"use server";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/server/db";
import { gameRssEntries, gameRssVotes } from "@/server/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

/**
 * GRAB ALL SUBMISSIONS FOR A GAME
 * PLUS THE CURRENT USER'S VOTE FOR INITIAL RENDER STATE OF ARROWS
 */
export async function getInitialRss(currentGameId: number) {
  const user = auth();
  const currentUser = user.userId;

  const query = db
    .select({
      rssId: gameRssEntries.rssId,
      author: gameRssEntries.author,
      title: gameRssEntries.title,
      url: gameRssEntries.url,
      description: gameRssEntries.description,
      section: gameRssEntries.section,
      score: gameRssEntries.score,
      ...(currentUser ? { currentUserVote: gameRssVotes.voteType } : {}),
    })
    .from(gameRssEntries)
    .where(eq(gameRssEntries.gameId, currentGameId))
    .orderBy(desc(gameRssEntries.score));

  const dynamicQuery = query.$dynamic();

  try {
    // If user isn't logged in ignore leftJoin() and currentUserVote field check
    if (!currentUser) {
      return await query;
    }

    return await dynamicQuery.leftJoin(
      gameRssVotes,
      and(eq(gameRssEntries.rssId, gameRssVotes.rssId), eq(gameRssVotes.voterId, currentUser))
    );
  } catch (err) {
    return { error: "DATABASE ERROR: Failed to Fetch Resources." };
  }
}

/**
 * FETCH DATA FOR CURRENT GAME
 */
export async function getGameData(query: string) {
  // Initially had try/catch but realized I really don't need it
  // because of how I'm handling this specific actions' errors
  // by having two different UI-wide outputs from the same component using gameData?.xyz
  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.CLIENT_ID,
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    } as HeadersInit,
    body: `fields name, cover.image_id, first_release_date, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, summary, websites.category, websites.url; where slug = "${query}" & version_parent = null & category = (0,4,8,9,12);`,
  });

  const data = await res.json();

  return data[0];
}

/**
 * USERS ADDING SUBMISSIONS
 */
const submissionSchema = z.object({
  rssId: z.number().int().positive().lte(2147483647), // Ignore, DB auto
  gameId: z.coerce.number().int().positive().lte(2147483647),
  author: z.string().max(255), // Ignore, get from auth
  title: z.string().trim().min(1).max(60),
  url: z.string().url().trim().min(1).max(1024),
  description: z.string().trim().min(1).max(160),
  /* DB takes any string, set enum for limited dead DB entries if user fucks with hidden form field */
  section: z.enum(["resources", "communities", "creators"]),
  slug: z.string().max(1024), // Only for page refresh, no use in DB
  score: z.number(), // Ignore, DB auto
  createdAt: z.date(), // Ignore, DB auto
  updatedAt: z.date(), // Ignore, DB auto
});
const CreateSubmission = submissionSchema.omit({
  rssId: true,
  author: true,
  score: true,
  createdAt: true,
  updatedAt: true,
});

export async function createSubmission(currentState: any, formData: FormData) {
  const user = auth();

  if (!user.userId) {
    // Figure out if I want periods at the end of these error messages for UI style purposes
    return {
      success: false,
      message: "SUBMISSION ERROR: Unauthorized.",
    };
  }

  const validated = CreateSubmission.safeParse({
    gameId: formData.get("gameId"),
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description"),
    section: formData.get("section"),
    slug: formData.get("slug"),
  });

  if (!validated.success) {
    return { success: false, message: "SUBMISSION ERROR: Invalid Fields." };
  }

  const { gameId, title, url, description, section, slug } = validated.data;
  const author = user.userId;

  try {
    await db.transaction(async (tx) => {
      const [insertedRssId] = await tx
        .insert(gameRssEntries)
        .values({ gameId: gameId, author: author, title: title, url: url, description: description, section: section })
        .returning({ id: gameRssEntries.rssId });
      await tx.insert(gameRssVotes).values({ rssId: insertedRssId!.id, voterId: author, voteType: true });
    });
  } catch (err) {
    return {
      success: false,
      message: "DATABASE ERROR: Failed to Create Submission.",
    };
  }

  revalidatePath(`/game/${slug}`);
  return { success: true, message: "SUCCESS: Submission Added." };
}

/**
 * USERS VOTING
 */
const voteSchema = z.object({
  voteId: z.number().int().positive().lte(2147483647), // Ignore, DB auto
  rssId: z.coerce.number().int().positive().lte(2147483647),
  voterId: z.string().max(255), // Ignore, get from auth
  voteType: z.boolean(),
  createdAt: z.date(), // Ignore, DB auto
  updatedAt: z.date(), // Ignore, DB auto
});
const CreateVote = voteSchema.omit({ voteId: true, voterId: true, createdAt: true, updatedAt: true });

export async function createVote(rssId: number, voteType: boolean) {
  const user = auth();
  if (!user.userId) return { message: "INVALID VOTE: Unauthorized", errors: { auth: ["User is not Authorized."] } };

  const validated = CreateVote.safeParse({
    rssId,
    voteType,
  });
  if (!validated.success) {
    return {
      message: "INVALID VOTE: Failed to Create Vote.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { rssId: submissionId, voteType: voteInput } = validated.data;
  const currentUserId = user.userId;

  // RETURN FORMAT: { data: {}, message: "", errors: {} }
  // TRANSACTION ERROR HANDLING: Throwing an error anywhere within transaction will cause a rollback.
  // Alternatively, you can call tx.rollback() manually.
  try {
    // GET CURRENTUSER'S CURRENT VOTE ON SUBMISSION IF EXISTS - Returns [], [{currentUserVote: boolean}]
    const currentUserVote = await db
      .select({ currentUserVote: gameRssVotes.voteType })
      .from(gameRssVotes)
      .where(and(eq(gameRssVotes.rssId, submissionId), eq(gameRssVotes.voterId, currentUserId)));
    const [currentSubmissionScore] = await db
      .select({ score: gameRssEntries.score })
      .from(gameRssEntries)
      .where(eq(gameRssEntries.rssId, submissionId));

    if (!currentUserVote || isNaN(currentSubmissionScore!.score)) {
      return {
        message: "DATABASE ERROR: Could not retrieve current vote or submission score.",
        errors: { database: ["Could not retrieve current vote or submission score."] },
      };
    }

    if (!currentUserVote.length) {
      // IF NO EXISTING VOTE: Add voteInput to table, update score.
      const voteResult = await db.transaction(async (tx) => {
        const [newVote] = await tx
          .insert(gameRssVotes)
          .values({ rssId: submissionId, voterId: currentUserId, voteType: voteInput })
          .returning({ newVote: gameRssVotes.voteType });
        const [newScore] = await tx
          .update(gameRssEntries)
          .set({ score: currentSubmissionScore!.score + (voteInput ? 1 : -1) })
          .where(eq(gameRssEntries.rssId, submissionId))
          .returning({ newScore: gameRssEntries.score });
        return { voteResult: newVote!.newVote, scoreResult: newScore!.newScore };
      });
      return { data: voteResult, message: "Vote Successfully Added." };
    } else {
      // ELSE IF EXISTING VOTE
      if (currentUserVote[0]!.currentUserVote !== voteInput) {
        // AND EXISTING VOTE IS DIFFERENT THAN INPUT VOTE: Update vote to voteInput, update score.
        const voteResult = await db.transaction(async (tx) => {
          const [newVote] = await tx
            .update(gameRssVotes)
            .set({ voteType: voteInput })
            .where(and(eq(gameRssVotes.rssId, submissionId), eq(gameRssVotes.voterId, currentUserId)))
            .returning({ newVote: gameRssVotes.voteType });
          const [newScore] = await tx
            .update(gameRssEntries)
            .set({ score: currentSubmissionScore!.score + (voteInput ? 2 : -2) })
            .where(eq(gameRssEntries.rssId, submissionId))
            .returning({ newScore: gameRssEntries.score });
          return { voteResult: newVote!.newVote, scoreResult: newScore!.newScore };
        });
        return { data: voteResult, message: "Vote Successfully Modified." };
      } else {
        // ELSE - AND EXISTING VOTE IS SAME AS NEW VOTE: Delete vote from table, update score.
        const voteResult = await db.transaction(async (tx) => {
          await tx
            .delete(gameRssVotes)
            .where(and(eq(gameRssVotes.rssId, submissionId), eq(gameRssVotes.voterId, currentUserId)));
          const [newScore] = await tx
            .update(gameRssEntries)
            .set({ score: currentSubmissionScore!.score + (voteInput ? -1 : 1) })
            .where(eq(gameRssEntries.rssId, submissionId))
            .returning({ newScore: gameRssEntries.score });
          return { voteResult: null, scoreResult: newScore!.newScore };
        });
        return { data: voteResult, message: "Vote Successfully Deleted." };
      }
    }
  } catch (err: any) {
    return {
      message: "DATABASE ERROR: Vote and score were not modified.",
      errors: { database: ["Vote and score were not modified."] },
    };
  }
}
