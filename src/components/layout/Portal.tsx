"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Portal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    setMounted(true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      setMounted(false);
    };
  }, []);

  return mounted ? createPortal(children, document.querySelector("#portal")!) : null;
}
