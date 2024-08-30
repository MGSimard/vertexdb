"use client";

import { Portal } from "@/components/layout/Portal";
import { CardLarge } from "@/components/CardLarge";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal">
        <CardLarge>{children}</CardLarge>
      </div>
    </Portal>
  );
}
