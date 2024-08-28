"use client";
import { Warning } from "../icons";
import { createReport } from "@/server/actions";

export function ReportButton({ info }: { info: any }) {
  const beingReported = info.rssId;

  return (
    <button className="report-btn" title="Report Submission" onClick={() => createReport(beingReported)}>
      <Warning />
    </button>
  );
}
