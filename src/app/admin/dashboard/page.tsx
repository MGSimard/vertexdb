import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CardLarge } from "@/components/page_dashboard/CardLarge";
import "@/styles/dashboard.css";
import { getTotalSubmissions, getTotalVotes } from "@/server/actions";

export default async function Page() {
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    notFound();
  }

  const totalSubmissions = await getTotalSubmissions();
  const totalVotes = await getTotalVotes();

  return (
    <main className="admin">
      <section>
        <h2>STATISTICS</h2>
        <div className="grid-113x">
          <CardLarge title="ENTRIES">
            <output className="largeNum">{totalSubmissions.data?.count ?? "ERR"}</output> TOTAL
          </CardLarge>
          <CardLarge title="VOTES">
            <output className="largeNum">{totalVotes.data?.count ?? "ERR"}</output> TOTAL
          </CardLarge>
          <CardLarge title="REPORTS">
            <ul className="grid-4x">
              <li>
                <output className="largeNum">0</output> PENDING
              </li>
              <li>
                <output className="largeNum">0</output> APPROVED
              </li>
              <li>
                <output className="largeNum">0</output> DENIED
              </li>
              <li>
                <output className="largeNum">0</output> LIFETIME
              </li>
            </ul>
          </CardLarge>
        </div>
      </section>
      <section>
        <h2>REPORTS</h2>
        <CardLarge title="REPORT BOARD">
          <p>
            The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as
            it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed
            starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be
            completed each time you hear this sound. [ding]
          </p>
        </CardLarge>
      </section>
    </main>
  );
}
