import { isoToUTC } from "@/utils/isoToUTC";

export function PendingReportsTable({ pendingReports }: { pendingReports: any }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Report ID</th>
          <th>Game ID</th>
          <th>Submission ID</th>
          <th>Report By</th>
          <th>Author</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {pendingReports.data.map((report: any) => (
          <ReportRow reportInfo={report} />
        ))}
      </tbody>
    </table>
  );
}

const ReportRow = ({ reportInfo }: { reportInfo: any }) => {
  const { rptId, rssId, reportBy, authorId, createdAt, gameId } = reportInfo;

  return (
    <tr>
      <td>{rptId}</td>
      <td>{gameId}</td>
      <td>{rssId}</td>
      <td>{reportBy}</td>
      <td>{authorId}</td>
      <td>{isoToUTC(createdAt)}</td>
    </tr>
  );
};
