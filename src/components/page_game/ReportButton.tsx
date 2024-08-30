"use client";
import { Modal } from "../layout/Modal";
import { Warning } from "../icons";
import { ReportForm } from "./ReportForm";
import { useState } from "react";

export function ReportButton({ info }: { info: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const beingReported = info.rssId;

  const handleModalOpen = () => {
    console.log("Report button pressed");
    console.log(info);

    if (!isModalOpen) {
      console.log("Modal Triggered");
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button className="report-btn" title="Report Submission" onClick={handleModalOpen}>
        <Warning />
      </button>
      <Modal isOpen={isModalOpen}>
        <ReportForm rssId={beingReported} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
