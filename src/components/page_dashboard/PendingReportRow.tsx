import { getNameCover } from "@/server/actions";
import { ModerateButton } from "@/components/page_dashboard/ModerateButton";
import { coverPath, isoToUTC } from "@/utils/helpers";
import type { ReportTypes } from "@/types/types";

export async function PendingReportRow({ reportInfo }: { reportInfo: ReportTypes }) {
  console.log(reportInfo);

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
        alt="Game Cover"
      />
      <div className="prr-right">
        <div>
          <h3>GAME</h3>
          <p className="prr-game">{nameAndCover?.name.toUpperCase() ?? "NOT FOUND"}</p>
        </div>
        <div>
          <h3>SUBMISSION DATA</h3>
          <table className="table-admin">
            <tbody>
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
                <th>RSS ID:</th>
                <td>{rssId}</td>
              </tr>
              <tr>
                <th>AUTHOR:</th>
                <td>{authorId}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3>REPORT DATA</h3>
          <table className="table-admin">
            <tbody>
              <tr>
                <th>REASON:</th>
                <td>{reportReason}</td>
              </tr>
              <tr>
                <th>COMMENT:</th>
                <td>{optionalComment.length ? optionalComment : "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="prr-foot">
          <span className="prr-note">
            report by {reportBy} on {isoToUTC(createdAt)} (ID #{rptId})
          </span>
          <div className="modbuttons">
            <ModerateButton approve={false} reportId={rptId} />
            <ModerateButton approve={true} reportId={rptId} rssId={rssId} />
          </div>
        </div>
      </div>
    </li>
  );
}
