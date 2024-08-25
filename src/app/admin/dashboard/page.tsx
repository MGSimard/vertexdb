import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default function Page() {
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    notFound();
  }

  console.log(currentUser);

  return (
    <main>
      <section></section>
    </main>
  );
}
