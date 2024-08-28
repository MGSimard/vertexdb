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
        <div>
          <table className="table-admin">
            <tbody>
              <tr>
                <th>GAME:</th>
                <td>
                  {nameAndCover?.name.toUpperCase() ?? "NOT FOUND"}
                  <small> (#{gameId})</small>
                </td>
              </tr>
              <tr>
                <th>TITLE:</th>
                <td>{title}</td>
              </tr>
              <tr>
                <th>URL:</th>
                <td>{url}</td>
              </tr>
              <tr>
                <th>DESCRIPTION:</th>
                <td>{description}</td>
              </tr>
              <tr>
                <th>SCORE:</th>
                <td>{score}</td>
              </tr>
            </tbody>
          </table>
          <small className="prr-author">
            Submission ID #{rssId} by {authorId}
          </small>
        </div>
        <span className="prr-foot">
          report by {reportBy} on {isoToUTC(createdAt)} (ID #{rptId})
        </span>
      </div>
      <div className="prr-right">
        <ModerateButton approve={false} reportId={rptId} />
        <ModerateButton approve={true} reportId={rptId} rssId={rssId} />
      </div>
    </li>
  );
}
