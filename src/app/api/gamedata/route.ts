import { NextRequest, NextResponse } from "next/server";
import { getGameInfo } from "@/server/queries";

// API Endpoint @api/gamedata?query=xxxx
// Intercepts query from URL, runs getGameInfo, returns game info.
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") ?? "";

  return NextResponse.json(await getGameInfo(query));
}
