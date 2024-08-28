import { isoToUTC } from "@/utils/isoToUTC";

export function PendingReportRow({ reportInfo }: { reportInfo: any }) {
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
}
{
  /* <th>Report ID</th>
<th>Game ID</th>
<th>Submission ID</th>
<th>Report By</th>
<th>Author</th>
<th>Created At</th> */
}
