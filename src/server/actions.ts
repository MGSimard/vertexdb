"use server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq, and, desc, count, sql, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { gameRssEntries, gameRssVotes, rssReports } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { ratelimit } from "@/server/ratelimit";
import { reportReasonEnums, sectionEnums } from "@/utils/enums";
import type {
  FormStatusTypes,
  GamedataResponseTypes,
  GamedataTypes,
  GameSearchbarTypes,
  GetGamesResponseTypes,
  GetNameCoverResponseTypes,
  GetNameCoverTypes,
} from "@/types/types";
import { headers } from "next/headers";

/* SEARCH BAR FETCH */
export async function getGames(query: string): Promise<GetGamesResponseTypes> {
  // Optional ratelimit for both auth and non-auth users on non-auth server actions
  // const user = auth();
  // const forwardedFor = headers().get("x-forwarded-for");
  // const realIP = headers().get("x-real-ip");

  // // Since this server action is allowed for non-auth users
  // // We need to identify them with something other than auth if not auth
  // const getUserIdentifier = () => {
  //   if (user.userId) return user.userId;

  //   if (forwardedFor) {
  //     return forwardedFor.split(",")[0]!.trim();
  //   } else if (realIP) {
  //     return realIP.trim();
  //   } else {
  //     return "0.0.0.0";
  //   }
  // };

  // const { success } = await ratelimit.limit(getUserIdentifier());
  // if (!success) {
  //   return { success: false, message: "RATELIMIT ERROR: Too many actions." };
  // }

  try {
    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN}`,
      } as HeadersInit,
      body: `fields name, slug, cover.image_id; where version_parent = null & category = (0,4,8,9,12);limit 9; search "${query}";`,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = (await res.json()) as GameSearchbarTypes[];

    return { success: true, data, message: "SUCCESS: Searched game list indexed." };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }
}

/* FETCH CURRENTGAME DATA */
export async function getGameData(query: string): Promise<GamedataResponseTypes> {
  // Optional ratelimit for both auth and non-auth users on non-auth server actions
  // const user = auth();
  // const forwardedFor = headers().get("x-forwarded-for");
  // const realIP = headers().get("x-real-ip");

  // // Since this server action is allowed for non-auth users
  // // We need to identify them with something other than auth if not auth
  // const getUserIdentifier = () => {
  //   if (user.userId) return user.userId;

  //   if (forwardedFor) {
  //     return forwardedFor.split(",")[0]!.trim();
  //   } else if (realIP) {
  //     return realIP.trim();
  //   } else {
  //     return "0.0.0.0";
  //   }
  // };

  // const { success } = await ratelimit.limit(getUserIdentifier());
  // if (!success) {
  //   return { success: false, message: "RATELIMIT ERROR: Too many actions." };
  // }

  try {
    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN}`,
      } as HeadersInit,
      body: `fields name, cover.image_id, first_release_date, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, summary, websites.category, websites.url; where slug = "${query}" & version_parent = null & category = (0,4,8,9,12);`,
    });

    if (!res.ok) throw new Error(`HTTP ERROR: ${res.status}`);

    const data = (await res.json()) as GamedataTypes[];

    if (!data.length) {
      throw new Error("IGDB ERROR: Matching game not found.");
    }

    return { success: true, data: data[0], message: "SUCCESS: Retrieved game data." };
  } catch (err) {
    return { success: false, message: "IGDB ERROR: Failed to retrieve game data." };
  }
}

/* FETCH CURRENTGAME SUBMISSIONS */
export async function getInitialRss(currentGameId: number | undefined) {
  if (currentGameId === null || currentGameId === undefined) {
    return { success: false, message: "DATABASE ERROR: Missing game ID." };
  }
  const user = auth();

  // Optional ratelimit for both auth and non-auth users on non-auth server actions
  // const forwardedFor = headers().get("x-forwarded-for");
  // const realIP = headers().get("x-real-ip");

  // // Since this server action is allowed for non-auth users
  // // We need to identify them with something other than auth if not auth
  // const getUserIdentifier = () => {
  //   if (user.userId) return user.userId;

  //   if (forwardedFor) {
  //     return forwardedFor.split(",")[0]!.trim();
  //   } else if (realIP) {
  //     return realIP.trim();
  //   } else {
  //     return "0.0.0.0";
  //   }
  // };

  // const { success } = await ratelimit.limit(getUserIdentifier());
  // if (!success) {
  //   return { success: false, message: "RATELIMIT ERROR: Too many actions." };
  // }

  try {
    const query = db
      .select({
        rssId: gameRssEntries.rssId,
        title: gameRssEntries.title,
        url: gameRssEntries.url,
        description: gameRssEntries.description,
        section: gameRssEntries.section,
        score: gameRssEntries.score,
        ...(user.userId ? { currentUserVote: gameRssVotes.voteType } : {}),
      })
      .from(gameRssEntries)
      .where(and(eq(gameRssEntries.gameId, currentGameId), isNull(gameRssEntries.deletedAt)))
      .orderBy(desc(gameRssEntries.score));

    const dynamicQuery = query.$dynamic();
    // If user isn't logged in ignore leftJoin() and currentUserVote field check
    if (!user.userId) {
      const data = await query;
      return { success: true, data, message: "SUCCESS: Submissions retrieved." };
    }

    const data = await dynamicQuery.leftJoin(
      gameRssVotes,
      and(eq(gameRssEntries.rssId, gameRssVotes.rssId), eq(gameRssVotes.voterId, user.userId))
    );
    return { success: true, data, message: "SUCCESS: Submissions retrieved." };
  } catch (err) {
    return { success: false, message: "DATABASE ERROR: Failed to retrieve submissions." };
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

export async function createSubmission(currentState: FormStatusTypes, formData: FormData) {
  const user = auth();

  if (!user.userId) {
    return { success: false, message: "AUTH ERROR: Unauthorized." };
  }

  const { success } = await ratelimit.limit(user.userId);
  if (!success) {
    return { success: false, message: "RATELIMIT: Too many actions." };
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
    return { success: false, message: "VALIDATION ERROR: Invalid fields." };
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
    return { success: false, message: "DATABASE ERROR: Failed to create submission." };
  }

  revalidatePath(`/game/${slug}`);
  return { success: true, message: "SUCCESS: Submission added." };
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
  if (!user.userId) {
    return { success: false, message: "AUTH ERROR: Unauthorized" };
  }

  const { success } = await ratelimit.limit(user.userId);
  if (!success) {
    return { success: false, message: "RATELIMIT ERROR: Too many actions." };
  }

  const validated = CreateVote.safeParse({
    rssId,
    voteType,
  });
  if (!validated.success) {
    return { success: false, message: "VALIDATION ERROR: Failed to create vote." };
  }

  const { rssId: submissionId, voteType: voteInput } = validated.data;
  const currentUserId = user.userId;

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

    if (!currentSubmission || currentSubmission?.deletedAt !== null) {
      throw new Error("DATABASE ERROR: This submission no longer exists.");
    }

    if (!currentUserVote || isNaN(currentSubmission.score)) {
      throw new Error("DATABASE ERROR: Could not retrieve current vote or submission score.");
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
          .set({ score: currentSubmission.score + (voteInput ? 1 : -1) })
          .where(eq(gameRssEntries.rssId, submissionId))
          .returning({ newScore: gameRssEntries.score });
        return { voteResult: newVote!.newVote, scoreResult: newScore!.newScore };
      });
      return { success: true, data: voteResult, message: "SUCCESS: Vote successfully added." };
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
            .set({ score: currentSubmission.score + (voteInput ? 2 : -2) })
            .where(eq(gameRssEntries.rssId, submissionId))
            .returning({ newScore: gameRssEntries.score });
          return { voteResult: newVote!.newVote, scoreResult: newScore!.newScore };
        });
        return { success: true, data: voteResult, message: "SUCCESS: Vote successfully modified." };
      } else {
        // ELSE - AND EXISTING VOTE IS SAME AS NEW VOTE: Delete vote from table, update score.
        const voteResult = await db.transaction(async (tx) => {
          await tx
            .delete(gameRssVotes)
            .where(and(eq(gameRssVotes.rssId, submissionId), eq(gameRssVotes.voterId, currentUserId)));
          const [newScore] = await tx
            .update(gameRssEntries)
            .set({ score: currentSubmission.score + (voteInput ? -1 : 1) })
            .where(eq(gameRssEntries.rssId, submissionId))
            .returning({ newScore: gameRssEntries.score });
          return { voteResult: null, scoreResult: newScore!.newScore };
        });
        return { success: true, data: voteResult, message: "SUCCESS: Vote Successfully deleted." };
      }
    }
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
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
export async function createReport(currentState: FormStatusTypes, formData: FormData) {
  const user = auth();
  if (!user.userId) {
    return { success: false, message: "AUTH ERROR: Unauthorized." };
  }

  const { success } = await ratelimit.limit(user.userId);
  if (!success) {
    return { success: false, message: "RATELIMIT ERROR: Too many actions." };
  }

  const validated = CreateReport.safeParse({
    rssId: formData.get("report-rssId"),
    reportReason: formData.get("report-reportReason"),
    optionalComment: formData.get("report-optionalComment"),
  });
  if (!validated.success) {
    return { success: false, message: "VALIDATION ERROR: Invalid fields." };
  }

  const { rssId, reportReason, optionalComment } = validated.data;
  const currentUserId = user.userId;

  try {
    const [currentSubmission] = await db
      .select({ deletedAt: gameRssEntries.deletedAt })
      .from(gameRssEntries)
      .where(eq(gameRssEntries.rssId, rssId));

    if (!currentSubmission || currentSubmission?.deletedAt !== null) {
      throw new Error("DATABASE ERROR: This submission no longer exists.");
    }

    // Existing entry conflict already handled by schema unique combo for rssId + currentUserId
    await db
      .insert(rssReports)
      .values({ rssId, reportBy: currentUserId, reportReason, optionalComment, status: "pending" });
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && Number(err.code) === 23505) {
      return { success: false, message: "DUPLICATE ERROR: User has already submitted a report." };
    }
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "SUCCESS: Submission reported." };
}

/**
 * DASHBOARD ACTIONS
 */
/* GET TOTAL AMOUNT OF SUBMISSIONS */
export async function getTotalSubmissions() {
  try {
    const [submissionsAmount] = await db.select({ count: count() }).from(gameRssEntries);
    return { success: false, data: submissionsAmount, message: "SUCCESS: Retrieved total submissions." };
  } catch (err) {
    return { success: false, message: "DATABASE ERROR: Failed retrieving total submissions." };
  }
}

/* GET TOTAL AMOUNT OF VOTES */
export async function getTotalVotes() {
  try {
    const [votesAmount] = await db.select({ count: count() }).from(gameRssVotes);
    return { success: true, data: votesAmount, message: "SUCCESS: Retrieved total votes." };
  } catch (err) {
    return { success: false, message: "DATABASE ERROR: Failed retrieving total votes." };
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
    return { success: true, data: counts, message: "SUCCESS: Retrieved report counts." };
  } catch (err) {
    return { success: false, message: "DATABASE ERROR: Failed retrieving report counts." };
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
        reportReason: rssReports.reportReason,
        optionalComment: rssReports.optionalComment,
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

    return { success: true, data: pendingReports, message: "SUCCESS: Retrieved pending reports." };
  } catch (err) {
    return { success: false, message: "DATABASE ERROR: Failed retrieving pending reports." };
  }
}

/* GET GAME NAME & COVER IMAGE FOR REPORTS IN ADMIN DASHBOARD */
export async function getNameCover(gameId: number | null): Promise<GetNameCoverResponseTypes> {
  try {
    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN}`,
      } as HeadersInit,
      body: `fields name, cover.image_id; where id = ${gameId};`,
    });

    if (!res.ok) throw new Error(`HTTP ERROR: ${res.status}`);

    const data = (await res.json()) as GetNameCoverTypes[];

    if (!data.length) throw new Error("IGDB ERROR: Game does not exist.");

    return { success: true, data: data[0], message: "SUCCESS: Fetched game name & cover." };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }
}

/* APPROVE REPORT, DELETE SUBMISSION, STATUS APPROVED */
const approveSchema = z.object({
  reportId: z.coerce.number().int().positive().lte(2147483647),
  rssId: z.coerce.number().int().positive().lte(2147483647),
});
export async function modApproveReport(reportId: number, rssId: number) {
  const currentUser = auth();
  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    return { success: false, message: "AUTH ERROR: Unauthorized" };
  }

  const { success } = await ratelimit.limit(currentUser.userId);
  if (!success) {
    return { success: false, message: "RATELIMIT ERROR: Too many actions." };
  }

  const validated = approveSchema.safeParse({ reportId, rssId });
  if (!validated.success) {
    return { success: false, message: "VALIDATION ERROR: Failed to approve report." };
  }

  try {
    await db.transaction(async (tx) => {
      const [currentStatus] = await tx
        .select({ status: rssReports.status })
        .from(rssReports)
        .where(eq(rssReports.rptId, reportId));

      if (!currentStatus) {
        throw new Error("DATABASE ERROR: This report no longer exists.");
      }

      // If report status was modified
      if (currentStatus.status !== "pending") {
        throw new Error("STATUS ERROR: This report is no longer in 'Pending' status.");
      }

      // Soft-delete submission by adding deleted_at time now()
      await tx
        .update(gameRssEntries)
        .set({ deletedAt: sql`now()` })
        .where(eq(gameRssEntries.rssId, rssId));

      // Update report status to approved
      await tx.update(rssReports).set({ status: "approved" }).where(eq(rssReports.rptId, reportId));

      // Set all other reports against that submission as status "collateral"
      // Gives context they were batch-accepted but not responsible while keeping stats
      await tx
        .update(rssReports)
        .set({ status: "collateral" })
        .where(and(eq(rssReports.rssId, rssId), eq(rssReports.status, "pending")));
    });
  } catch (err: unknown) {
    revalidatePath("/admin/dashboard");
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "SUCCESS: Set report status to 'APPROVED'." };
}

/* DENY A REPORT, KEEP SUBMISSION, STATUS DENIED */
const denySchema = z.object({
  reportId: z.coerce.number().int().positive().lte(2147483647),
});
export async function modDenyReport(reportId: number) {
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    return { success: false, message: "AUTH ERROR: Unauthorized" };
  }

  const { success } = await ratelimit.limit(currentUser.userId);
  if (!success) {
    return { success: false, message: "RATELIMIT ERROR: Too many actions." };
  }

  const validated = denySchema.safeParse({ reportId });
  if (!validated.success) {
    return { success: false, message: "VALIDATION ERROR: Failed to deny report." };
  }

  try {
    await db.transaction(async (tx) => {
      const [currentStatus] = await tx
        .select({ status: rssReports.status })
        .from(rssReports)
        .where(eq(rssReports.rptId, reportId));

      if (!currentStatus) {
        throw new Error("MODERATION ERROR: This report no longer exists.");
      }

      if (currentStatus.status !== "pending") {
        throw new Error("MODERATION ERROR: This report is no longer in 'PENDING' status.");
      }

      // Update report status to denied
      await tx.update(rssReports).set({ status: "denied" }).where(eq(rssReports.rptId, reportId));
    });
  } catch (err: unknown) {
    revalidatePath("/admin/dashboard");
    return { success: false, message: err instanceof Error ? err.message : "UNKNOWN ERROR." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "SUCCESS: Report status set to 'DENIED'." };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Cron job running at:", new Date().toISOString());

  await performCronTask();
  console.log("Cron job success");

  return NextResponse.json({ success: true });
}

async function performCronTask() {
  console.log("Performing performCronTask.");
  // For testing, just wait a second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("performCronTask successful.");
}

// async function getNewIgdbBearerToken() {
//   const postLink = `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`;
//   // Request new IGDB_BEARER_TOKEN from IGDB API.
//   // POST using IGDB_CLIENT_ID & IGDB_CLIENT_SECRET
//   // UPDATE IGDB_BEARER_TOKEN ON VERCEL ENV FOR PROD
//   // REDEPLOY BUILD TO SAVE ENV CHANGES
// }
