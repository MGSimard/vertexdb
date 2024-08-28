import { isoToUTC } from "@/utils/isoToUTC";

export function PendingReportRow({ reportInfo }: { reportInfo: any }) {
  const { rptId, rssId, reportBy, authorId, createdAt, gameId, title, url, description, score } = reportInfo;

  return (
    <div>
      <ul>
        <li>{rptId}</li>
        <li>{gameId}</li>
        <li>{rssId}</li>
        <li>{title}</li>
        <li>{url}</li>
        <li>{description}</li>
        <li>{score}</li>
        <li>{reportBy}</li>
        <li>{authorId}</li>
        <li>{isoToUTC(createdAt)}</li>
      </ul>
    </div>
  );
}
{
  /* <th>Report ID</th>
<th>Game ID</th>
<th>Submission ID</th>
<th>Report By</th>
<th>Author</th>
<th>Created At</th> */
}
