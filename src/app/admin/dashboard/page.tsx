import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getTotalSubmissions, getTotalVotes, getReportCounts } from "@/server/actions";
import { CardLarge } from "@/components/page_dashboard/CardLarge";
import "@/styles/dashboard.css";
import { Suspense } from "react";
import { CardReportCountSkeleton } from "@/components/page_dashboard/CardSkeletons";

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
            <output className="largeNum">{totalSubmissions.data?.count ?? "ERR"}</output>TOTAL
          </CardLarge>
          <CardLarge title="VOTES">
            <output className="largeNum">{totalVotes.data?.count ?? "ERR"}</output>TOTAL
          </CardLarge>
          <Suspense fallback={<CardReportCountSkeleton />}>
            <CardReportCount />
          </Suspense>
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

const CardReportCount = async () => {
  const reportCounts = await getReportCounts();
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return (
    <div className="card-large">
      <div className="card-large-inner">
        <div className="card-large-left"></div>
        <div className="card-large-content">
          <h3>REPORTS</h3>
          <ul className="grid-4x">
            <li>
              <output className="largeNum">{reportCounts.data?.pendingCount ?? "ERR"}</output>PENDING
            </li>
            <li>
              <output className="largeNum">{reportCounts.data?.approvedCount ?? "ERR"}</output>APPROVED
            </li>
            <li>
              <output className="largeNum">{reportCounts.data?.deniedCount ?? "ERR"}</output>DENIED
            </li>
            <li>
              <output className="largeNum">{reportCounts.data?.totalCount ?? "ERR"}</output>LIFETIME
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
