"use client";
import { useState } from "react";
import { Modal } from "@/components/layout/Modal";
import { ReportForm } from "@/components/page_game/ReportForm";
import { Warning } from "@/components/icons";

export function ReportButton({ info }: { info: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button className="report-btn" title="Report Submission" onClick={handleModalOpen}>
        <Warning />
      </button>
      <Modal isOpen={isModalOpen}>
        <ReportForm info={info} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
