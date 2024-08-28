"use client";

import { modApproveReport, modRejectReport } from "@/server/actions";
import { Checkmark, Clear } from "../icons";

export function ModerateButton({ approve, reportId, rssId }: { approve: boolean; reportId: number; rssId?: number }) {
  const handleAction = (approve: boolean, reportId: number) => {
    if (
      window.confirm(
        approve
          ? "Are you sure you want to approve this report? This action will delete the submission and all of its votes from the database. Report status will be set to 'Approved'"
          : "Are you sure you want to reject this report? This action will keep the reported submission. Report status will be set to 'Denied'."
      )
    ) {
      // If press OK run fitting action
      approve ? modApproveReport(reportId, rssId!) : modRejectReport(reportId);
    }
    // If cancel do nothing
  };

  return (
    <button
      type="button"
      className="btn-ui"
      onClick={() => handleAction(approve, reportId)}
      title={approve ? "Approve" : "Reject"}>
      {approve ? <Checkmark /> : <Clear />}
    </button>
  );
}
