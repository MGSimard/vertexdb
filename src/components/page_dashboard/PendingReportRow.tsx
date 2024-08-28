import { isoToUTC } from "@/utils/isoToUTC";
import { getNameCover } from "@/server/actions";
import { coverPath } from "@/utils/helpers";

interface getNameCoverTypes {
  id: number;
  cover: { id: number; image_id: string };
  name: string;
}

export async function PendingReportRow({ reportInfo }: { reportInfo: any }) {
  const { rptId, rssId, reportBy, authorId, createdAt, gameId, title, url, description, score } = reportInfo;

  const { name: gameName, cover } = await getNameCover(gameId);

  return (
    <li className="pendingReportRow">
      <img src={cover?.image_id ? coverPath("720p", cover.image_id) : "/missingasset.webp"} />

      <div>Report ID: {rptId}</div>
      <div>Game ID: {gameId}</div>
      <div>Submission ID: {rssId}</div>
      <div>Title: {title}</div>
      <div>URL: {url}</div>
      <div>Description: {description}</div>
      <div>Score: {score}</div>
      <div>Reported By:{reportBy}</div>
      <div>Submission Author:{authorId}</div>
      <div>Report Time: {isoToUTC(createdAt)}</div>
    </li>
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
