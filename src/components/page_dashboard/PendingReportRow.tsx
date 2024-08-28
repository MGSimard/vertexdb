import { isoToUTC } from "@/utils/isoToUTC";
import { getNameCover } from "@/server/actions";
import { coverPath } from "@/utils/helpers";
import { ModerateButton } from "./ModerateButton";

interface getNameCoverTypes {
  id: number;
  cover: { id: number; image_id: string };
  name: string;
}

export async function PendingReportRow({ reportInfo }: { reportInfo: any }) {
  const { rptId, rssId, reportBy, authorId, createdAt, gameId, title, url, description, score } = reportInfo;

  const nameAndCover = await getNameCover(gameId);

  return (
    <li className="pendingReportRow">
      <img
        className="prr-left"
        src={nameAndCover?.cover?.image_id ? coverPath("720p", nameAndCover.cover.image_id) : "/missingasset.webp"}
      />
      <div className="prr-center">
        {/* <div>
          {nameAndCover?.name ?? "ERR"}
          <small>(#{gameId})</small>
        </div> */}
        <div>
          <h4>{title}</h4>
          <span className="prr-url">{url}</span>
          <p>{description}</p>
          <div>Submitted By: {authorId}</div>
        </div>
        <span className="prr-foot">report by: {reportBy}</span>
      </div>
      <div className="prr-right">
        <ModerateButton approve={false} reportId={rptId} />
        <ModerateButton approve={true} reportId={rptId} rssId={rssId} />
      </div>
      {/* <div>Report ID: {rptId}</div>
      <div>Submission ID: {rssId}</div>
      <div>Score: {score}</div> */}
      {/* <div>Reported By:{reportBy}</div>
      <div>Submission Author:{authorId}</div>
      <div>Report Time: {isoToUTC(createdAt)}</div> */}
    </li>
  );
}
