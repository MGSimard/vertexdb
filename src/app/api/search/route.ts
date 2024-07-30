import { type NextRequest, NextResponse } from "next/server";
import { searchGames } from "@/server/queries";

// API Endpoint @api/search?query=xxxx
// Intercepts query from URL, runs searchGames, returns top 10 results.
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") ?? "";

  return NextResponse.json(await searchGames(query));
}
