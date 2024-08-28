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
    <div>
      <img src={cover.image_id ? coverPath("720p", cover.image_id) : "/missingasset.webp"} />

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
