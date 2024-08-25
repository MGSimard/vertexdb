import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default function Page() {
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    notFound();
  }

  return (
    <main>
      <section>
        <h2>Dashboard Page</h2>
      </section>
    </main>
  );
}
