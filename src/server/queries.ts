import "server-only";

// SEARCHBAR RESULT FETCHER
// "${query}" (from query params in api/search?query=, set by user search in searchbar)
export async function searchGames(query: string) {
  try {
    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.CLIENT_ID,
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      } as HeadersInit,
      body: `fields name, slug, cover.image_id; where version_parent = null & category = (0,4,8,9,12);limit 9; search "${query}";`,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    return { error: err.message };
  }
}
