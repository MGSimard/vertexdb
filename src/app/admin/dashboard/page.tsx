import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { CardLarge } from "@/components/page_dashboard/CardLarge";
import "@/styles/dashboard.css";

export default function Page() {
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    notFound();
  }

  return (
    <main>
      <section className="grid-3x">
        <CardLarge title="SUBMISSION STATISTICS">
          <ul>
            <li>Total Submissions</li>
          </ul>
        </CardLarge>
        <CardLarge title="VOTING STATISTICS">
          <ul>
            <li>Total Votes</li>
          </ul>
        </CardLarge>
        <CardLarge title="REPORTS STATISTICS">
          <ul>
            <li>- Lifetime Reports #</li>
            <li>- Accepted Reports #</li>
            <li>- Declined Reports #</li>
          </ul>
        </CardLarge>
      </section>
      <section>
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
