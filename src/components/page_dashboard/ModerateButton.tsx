"use client";

import { modApproveReport, modDenyReport } from "@/server/actions";
import { Checkmark, Clear } from "@/components/icons";

interface ModerateButtonTypes {
  approve: boolean;
  reportId: number;
  rssId?: number;
}

export function ModerateButton({ approve, reportId, rssId }: ModerateButtonTypes) {
  const approveMessage =
    "Are you sure you want to approve this report?\n\n- This action will soft-delete the submission, it and its votes will still be kept within the database.\n- Report status will be set to 'APPROVED'.\n- All other reports against the submission will be set to 'COLLATERAL'.";
  const denyMessage =
    "Are you sure you want to deny this report?\n\n- This action will keep the reported submission.\n- Report status will be set to 'DENIED'.";

  const handleApprove = (reportId: number) => {
    if (window.confirm(approveMessage)) modApproveReport(reportId, rssId!);
  };
  const handleDeny = (reportId: number) => {
    if (window.confirm(denyMessage)) modDenyReport(reportId);
  };

  return approve ? (
    <button type="button" className="btn-mod" onClick={() => handleApprove(reportId)}>
      <Checkmark /> <span>APPROVE</span>
    </button>
  ) : (
    <button type="button" className="btn-mod" onClick={() => handleDeny(reportId)}>
      <Clear /> <span>DENY</span>
    </button>
  );
}
