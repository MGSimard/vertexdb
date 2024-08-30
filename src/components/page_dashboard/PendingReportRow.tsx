import { getNameCover } from "@/server/actions";
import { ModerateButton } from "@/components/page_dashboard/ModerateButton";
import { coverPath, isoToUTC } from "@/utils/helpers";

export async function PendingReportRow({ reportInfo }: { reportInfo: any }) {
  const {
    rptId,
    rssId,
    reportBy,
    reportReason,
    optionalComment,
    createdAt,
    gameId,
    authorId,
    title,
    url,
    description,
    score,
  } = reportInfo;

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
                <th>DESC:</th>
                <td>{description}</td>
              </tr>
              <tr>
                <th>SCORE:</th>
                <td>{score}</td>
              </tr>
              <tr>
                <th>REPORT REASON:</th>
                <td>{reportReason}</td>
              </tr>
              <tr>
                <th>COMMENT:</th>
                <td>{optionalComment ?? "N/A"}</td>
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
