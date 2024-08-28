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
    <li>
      <img className="" src={cover.image_id ? coverPath("720p", cover.image_id) : "/missingasset.webp"} />

      <div>{rptId}</div>
      <div>{gameId}</div>
      <div>{rssId}</div>
      <div>{title}</div>
      <div>{url}</div>
      <div>{description}</div>
      <div>{score}</div>
      <div>{reportBy}</div>
      <div>{authorId}</div>
      <div>{isoToUTC(createdAt)}</div>
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
