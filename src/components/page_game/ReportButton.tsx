"use client";
import { Warning } from "../icons";
import { createReport } from "@/server/actions";
import { useState } from "react";
import { Modal } from "../layout/Modal";

export function ReportButton({ info }: { info: any }) {
  const beingReported = info.rssId;

  const [modalOpen, setModalOpen] = useState(false);

  //() => createReport(beingReported)

  const handleModalOpen = () => {
    if (!modalOpen) setModalOpen(true);
    console.log("jeff");
  };

  return (
    <>
      {modalOpen && <Modal />}
      <button className="report-btn" title="Report Submission" onClick={handleModalOpen}>
        <Warning />
      </button>
    </>
  );
}
