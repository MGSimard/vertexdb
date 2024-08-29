"use client";
import { Warning } from "../icons";
import { createReport } from "@/server/actions";
import { useState } from "react";
import { Modal } from "../layout/Modal";

export function ReportButton({ info }: { info: any }) {
  const beingReported = info.rssId;

  const [modalOpen, setModalOpen] = useState(false);

  //() =>

  const handleModalOpen = () => {
    if (!modalOpen) setModalOpen(true);
    console.log("jeff");

    /* we'll open a form and the submission will be form action, use same conventions as my other form with useActionState */
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
