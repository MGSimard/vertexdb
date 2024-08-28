"use server";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { gameRssEntries, gameRssVotes, rssReports } from "@/server/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ratelimit } from "./ratelimit";

/* FETCH CURRENTGAME SUBMISSIONS */
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

/* FETCH CURRENTGAME DATA */
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

/* CREATE SUBMISSION */
const submissionSchema = z.object({
  rssId: z.number().int().positive().lte(2147483647), // Ignore, DB auto
  gameId: z.coerce.number().int().positive().lte(2147483647),
  author: z.string().max(255), // Ignore, get from auth
  title: z.string().trim().min(1).max(60),
  url: z.string().url().trim().min(1).max(1024),
  description: z.string().trim().min(1).max(120),
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

  const { success } = await ratelimit.limit(user.userId);
  if (!success) return { success: false, message: "RATE-LIMITED: Too many actions." };

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

/* CREATE VOTE */
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

  const { success } = await ratelimit.limit(user.userId);
  if (!success) return { message: "RATELIMIT ERROR: Too many actions.", errors: { ratelimit: ["Too many actions."] } };

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
      return { data: voteResult, message: "SUCCESS: Vote Successfully Added." };
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
        return { data: voteResult, message: "SUCCESS: Vote Successfully Modified." };
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
        return { data: voteResult, message: "SUCCESS: Vote Successfully Deleted." };
      }
    }
  } catch (err: any) {
    return {
      message: "DATABASE ERROR: Vote and score were not modified.",
      errors: { database: ["Vote and score were not modified."] },
    };
  }
}

/* CREATE REPORT */
const reportSchema = z.object({
  rssId: z.coerce.number().int().positive().lte(2147483647),
  reportBy: z.string().max(255), // Auto from auth
});
const CreateReport = reportSchema.omit({ reportBy: true });

export async function createReport(rssId: number) {
  const user = auth();
  if (!user.userId) return { message: "INVALID REPORT: Unauthorized", errors: { auth: ["User is not Authorized."] } };

  const { success } = await ratelimit.limit(user.userId);
  if (!success) return { message: "RATELIMIT ERROR: Too many actions.", errors: { ratelimit: ["Too many actions."] } };

  const validated = CreateReport.safeParse({ rssId });
  if (!validated.success) {
    return {
      message: "INVALID REPORT: Failed to Create Report.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { rssId: reportedEntry } = validated.data;
  const currentUserId = user.userId;

  try {
    // Existing entry conflict already handled by schema unique combo for rssId + currentUserId
    await db.insert(rssReports).values({ rssId: reportedEntry, reportBy: currentUserId });
  } catch (err: any) {
    console.log("ERROR!!!");
    return {
      message: "DATABASE ERROR: Failed to create report.",
      errors: { database: ["Failed to create report."] },
    };
  }
}

/**
 * DASHBOARD ACTIONS
 */
/* GET TOTAL AMOUNT OF SUBMISSIONS */
export async function getTotalSubmissions() {
  try {
    const [submissionsAmount] = await db.select({ count: count() }).from(gameRssEntries);

    return { data: submissionsAmount, message: "SUCCESS: Retrieved total submissions." };
  } catch (err) {
    return { message: "DATABASE ERROR: Failed retrieving total submissions." };
  }
}
/* GET TOTAL AMOUNT OF VOTES */
export async function getTotalVotes() {
  try {
    const [votesAmount] = await db.select({ count: count() }).from(gameRssVotes);
    return { data: votesAmount, message: "SUCCESS: Retrieved total votes." };
  } catch (err) {
    return { message: "DATABASE ERROR: Failed retrieving total submissions." };
  }
}

/* GET COUNT OF ALL REPORT STATUS TYPES */
export async function getReportCounts() {
  try {
    const [counts] = await db
      .select({
        pendingCount: sql<number>`COUNT(CASE WHEN status = 'pending' THEN 1 END)::int`,
        approvedCount: sql<number>`COUNT(CASE WHEN status = 'approved' THEN 1 END)::int`,
        deniedCount: sql<number>`COUNT(CASE WHEN status = 'denied' THEN 1 END)::int`,
        totalCount: sql<number>`COUNT(*)::int`,
      })
      .from(rssReports);
    return { data: counts, message: "SUCCESS: Retrieved report counts." };
  } catch (err) {
    return { message: "DATABASE ERROR: Failed retrieving report counts." };
  }
}

/* GET REPORTS WITH PENDING STATUS */
export async function getPendingReports() {
  try {
    const test = await db.select().from(rssReports).where(eq(rssReports.status, "pending"));
    return { data: test, message: "SUCCESS: Retrieved pending reports." };
  } catch (err) {
    return { message: "DATABASE ERROR: Failed retrieving pending reports." };
  }
}
