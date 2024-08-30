"use server";
import { revalidatePath } from "next/cache";
import { eq, and, desc, count, sql, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { gameRssEntries, gameRssVotes, rssReports } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { ratelimit } from "@/server/ratelimit";
import { reportReasonEnums, sectionEnums } from "@/utils/enums";

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
    .where(and(eq(gameRssEntries.gameId, currentGameId), isNull(gameRssEntries.deletedAt)))
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

/* CREATE SUBMISSION */
const submissionSchema = z.object({
  rssId: z.number().int().positive().lte(2147483647), // Ignore, DB auto
  gameId: z.coerce.number().int().positive().lte(2147483647),
  author: z.string().max(255), // Ignore, get from auth
  title: z.string().trim().min(1).max(60),
  url: z.string().url().min(1).max(1024),
  description: z.string().trim().min(1).max(120),
  section: z.enum(sectionEnums),
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
    const [currentSubmission] = await db
      .select({ score: gameRssEntries.score, deletedAt: gameRssEntries.deletedAt })
      .from(gameRssEntries)
      .where(eq(gameRssEntries.rssId, submissionId));

    if (currentSubmission?.deletedAt !== null) {
      return {
        message: "DATABASE ERROR: This submission no longer exists.",
        errors: { database: ["This submission no longer exists."] },
      };
    }

    if (!currentUserVote || isNaN(currentSubmission!.score)) {
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
          .set({ score: currentSubmission!.score + (voteInput ? 1 : -1) })
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
            .set({ score: currentSubmission!.score + (voteInput ? 2 : -2) })
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
            .set({ score: currentSubmission!.score + (voteInput ? -1 : 1) })
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
  reportReason: z.enum(reportReasonEnums),
  optionalComment: z.string().max(120).trim(),
});
const CreateReport = reportSchema.omit({ reportBy: true });

export async function createReport(currentState: any, formData: FormData) {
  const user = auth();
  if (!user.userId) return { message: "INVALID REPORT: Unauthorized", errors: { auth: ["User is not Authorized."] } };

  const { success } = await ratelimit.limit(user.userId);
  if (!success) return { message: "RATELIMIT ERROR: Too many actions.", errors: { ratelimit: ["Too many actions."] } };

  const validated = CreateReport.safeParse({
    rssId: formData.get("report-rssId"),
    reportReason: formData.get("report-reportReason"),
    optionalComment: formData.get("report-optionalComment"),
  });
  if (!validated.success) {
    return {
      message: "INVALID REPORT: Failed to Create Report.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { rssId: reportedEntry } = validated.data;
  const currentUserId = user.userId;

  try {
    console.log("FORM SUBMITTED AND ALL VALIDATIONS PASSED");
    // Existing entry conflict already handled by schema unique combo for rssId + currentUserId
    // await db.insert(rssReports).values({ rssId: reportedEntry, reportBy: currentUserId });
  } catch (err: any) {
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
    const pendingReports = await db
      .select({
        rptId: rssReports.rptId,
        rssId: rssReports.rssId,
        reportBy: rssReports.reportBy,
        status: rssReports.status,
        createdAt: rssReports.createdAt,
        updatedAt: rssReports.updatedAt,
        gameId: gameRssEntries.gameId,
        authorId: gameRssEntries.author,
        title: gameRssEntries.title,
        url: gameRssEntries.url,
        description: gameRssEntries.description,
        score: gameRssEntries.score,
      })
      .from(rssReports)
      .leftJoin(gameRssEntries, eq(rssReports.rssId, gameRssEntries.rssId))
      .where(eq(rssReports.status, "pending"))
      .orderBy(desc(rssReports.createdAt));
    return { data: pendingReports, message: "SUCCESS: Retrieved pending reports." };
  } catch (err) {
    return { message: "DATABASE ERROR: Failed retrieving pending reports." };
  }
}

/* GET GAME NAME & COVER IMAGE FOR REPORTS IN ADMIN DASHBOARD */
export async function getNameCover(gameId: number) {
  // Same as last time, handle errors as alt missing data in component
  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.CLIENT_ID,
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    } as HeadersInit,
    body: `fields name, cover.image_id; where id = ${gameId};`,
  });

  const data = await res.json();

  return data[0];
}

/* APPROVE REPORT, DELETE SUBMISSION, STATUS APPROVED */
const approveSchema = z.object({
  reportId: z.coerce.number().int().positive().lte(2147483647),
  rssId: z.coerce.number().int().positive().lte(2147483647),
});
export async function modApproveReport(reportId: number, rssId: number) {
  console.log("Approve Report");
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    return { message: "INVALID REPORT: Unauthorized", errors: { auth: ["User is not Authorized."] } };
  }

  const { success } = await ratelimit.limit(currentUser.userId);
  if (!success) return { message: "RATELIMIT ERROR: Too many actions.", errors: { ratelimit: ["Too many actions."] } };

  const validated = approveSchema.safeParse({ reportId, rssId });
  if (!validated.success) {
    return {
      message: "INVALID REPORT: Failed to Create Report.",
      errors: validated.error.flatten().fieldErrors,
    };
  }
  console.log("Validation Passed.");

  try {
    // Use transaction
    // First verify if fitting report is still in pending status
    // If still pending, delete all votes for matching rssId, delete rssId, then change report status to approved
    // Ideally, set up the schema with ON DELETE SET NULL on the report's rssId foreign key
    // As for the votes, maybe ON DELETE DELETE if that's possible
    // This way you can delete a submission without foreign key constraint blocking the deletion
    // And the votes get automatically deleted + reports tied to it set to rssId = null.
  } catch (err) {}
}

/* REJECT A REPORT, KEEP SUBMISSION, STATUS DENIED */
const rejectSchema = z.object({
  reportId: z.coerce.number().int().positive().lte(2147483647),
});
export async function modRejectReport(reportId: number) {
  console.log("Reject Report");
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    return { message: "INVALID REPORT: Unauthorized", errors: { auth: ["User is not Authorized."] } };
  }

  const { success } = await ratelimit.limit(currentUser.userId);
  if (!success) return { message: "RATELIMIT ERROR: Too many actions.", errors: { ratelimit: ["Too many actions."] } };

  const validated = rejectSchema.safeParse({ reportId });
  if (!validated.success) {
    return {
      message: "INVALID REPORT: Failed to Create Report.",
      errors: validated.error.flatten().fieldErrors,
    };
  }
  console.log("Validation Passed.");

  try {
    // Use transaction
    // First verify if fitting report is still in pending status
    // If still pending, change report status to denied
  } catch (err) {}
}
