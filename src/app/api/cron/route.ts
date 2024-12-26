import { NextRequest, NextResponse } from "next/server";

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
