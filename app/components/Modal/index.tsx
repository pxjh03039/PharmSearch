"use client";

import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { useDialogModal } from "../Modal/hooks/useDialogModal";
import "./Modal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
};

export function Modal({
  isOpen,
  onClose,
  className,
  children,
}: PropsWithChildren<Props>) {
  const { targetContainer, dialogRef, onClickDialog } = useDialogModal(
    isOpen,
    onClose
  );

  if (!targetContainer) {
    return null;
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="modal"
      onClick={onClickDialog}
    >
      {children}
    </dialog>,
    targetContainer
  );
}
