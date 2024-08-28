import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getTotalSubmissions, getTotalVotes, getReportCounts, getPendingReports } from "@/server/actions";
import { CardLarge } from "@/components/page_dashboard/CardLarge";
import "@/styles/dashboard.css";
import { Suspense } from "react";
import { OtherCountSkeleton, ReportsCardSkeleton } from "@/components/page_dashboard/CardSkeletons";

export default async function Page() {
  const currentUser = auth();

  if (!currentUser.userId || currentUser.sessionClaims.metadata.role !== "admin") {
    notFound();
  }

  const pendingReports = await getPendingReports();

  return (
    <main className="admin">
      <section>
        <h2>STATISTICS</h2>
        <div className="grid-113x">
          <Suspense fallback={<OtherCountSkeleton title={"ENTRIES"} />}>
            <EntriesCard />
          </Suspense>
          <Suspense fallback={<OtherCountSkeleton title={"VOTES"} />}>
            <VotesCard />
          </Suspense>
          <Suspense fallback={<ReportsCardSkeleton />}>
            <ReportsCard />
          </Suspense>
        </div>
      </section>
      <section>
        <h2>REPORTS</h2>
        <CardLarge title="REPORT BOARD">
          {pendingReports.data
            ? pendingReports.data.map((report) => <PendingReport key={report.rptId} reportInfo={report} />)
            : "NO PENDING REPORTS."}
        </CardLarge>
      </section>
    </main>
  );
}

const EntriesCard = async () => {
  const totalSubmissions = await getTotalSubmissions();
  return (
    <CardLarge title="ENTRIES">
      <output className="largeNum">{totalSubmissions.data?.count ?? "ERR"}</output>TOTAL
    </CardLarge>
  );
};

const VotesCard = async () => {
  const totalVotes = await getTotalVotes();
  return (
    <CardLarge title="VOTES">
      <output className="largeNum">{totalVotes.data?.count ?? "ERR"}</output>TOTAL
    </CardLarge>
  );
};

const ReportsCard = async () => {
  const reportCounts = await getReportCounts();
  return (
    <CardLarge title="REPORTS">
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
    </CardLarge>
  );
};

const PendingReport = ({ reportInfo }: { reportInfo: any }) => {
  const { rptId, rssId, reportBy, createdAt, gameId } = reportInfo;

  const userLocale = navigator.language || "en-US";

  const formatter = new Intl.DateTimeFormat(userLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  });

  const formattedDate = formatter.format(createdAt);

  return (
    <li>
      <span>Report ID: {rptId}</span>
      <span>Game ID: {gameId}</span>
      <span>Submission ID: {rssId}</span>
      <span>Report By: {reportBy}</span>
      <span>Created At: {formattedDate}</span>
    </li>
  );
};
