"use client";

import { PropsWithChildren, ReactNode, useEffect } from "react";
import { usePreventScroll } from "./hooks/usePreventScroll";
import "./Modal.css";

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({
  isModalOpen,
  onClose,
  children,
}: PropsWithChildren<Props>) {
  usePreventScroll(isModalOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, onClose]);

  if (!isModalOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-content`}>{children}</div>
    </div>
  );
}
