"use client";

import { modApproveReport, modDenyReport } from "@/server/actions";
import { Checkmark, Clear } from "@/components/icons";
import { CustomToast } from "@/components/layout/CustomToast";
import { toast } from "sonner";

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

  const handleApprove = async (reportId: number) => {
    if (window.confirm(approveMessage)) {
      const result = await modApproveReport(reportId, rssId!);

      toast.custom(() => <CustomToast icon={result.success ? "success" : "warning"} message={result.message} />);
      if (!result.success) console.error(result.message);
    }
  };
  const handleDeny = async (reportId: number) => {
    if (window.confirm(denyMessage)) {
      const result = await modDenyReport(reportId);

      toast.custom(() => <CustomToast icon={result.success ? "success" : "warning"} message={result.message} />);
      if (!result.success) console.error(result.message);
    }
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
