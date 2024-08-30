"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Portal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  const handleKeyDown = (e: any) => {
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    setMounted(true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      setMounted(false);
    };
  }, []);

  return mounted ? createPortal(children, document.querySelector("#portal")!) : null;
}
