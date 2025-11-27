"use client";

import { Modal } from "@/app/components/Modal/Modal";
import { useModalStore } from "@/stores/useModalStore";

export default function GlobalModal() {
  const { isModalOpen, content, closeModal } = useModalStore();

  if (!isModalOpen) return null;

  return (
    <Modal isModalOpen={isModalOpen} onClose={closeModal}>
      {content}
    </Modal>
  );
}
