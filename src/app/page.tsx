import { Searchbar } from "@/components/searchbar/Searchbar";
import { db } from "@/server/db";

export default async function Page() {
  const posts = await db.query.posts.findMany();
  console.log(posts);
  return (
    <main className="index-main">
      <Searchbar />
      <div>
        <h2>THIS APP IS IN ACTIVE DEVELOPMENT MODE.</h2>
      </div>
      <div>
        Database test:{" "}
        {posts.map((post) => (
          <div key={post.id}>{JSON.stringify(post)}</div>
        ))}
      </div>
    </main>
  );
}
