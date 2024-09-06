"use client";

import { Portal } from "@/components/layout/Portal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const handleOutsideClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal onClose={onClose}>
      <div className="modal" onClick={handleOutsideClick}>
        <div className="card-large" onClick={(e) => e.stopPropagation()}>
          <div className="card-large-inner">
            <div className="card-large-left"></div>
            <div className="card-large-content">{children}</div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
