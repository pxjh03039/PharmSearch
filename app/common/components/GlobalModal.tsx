// app/components/Modal/GlobalModal.tsx
"use client";

import ErrorModal from "@/app/components/Modal/ErrorModal";
import { useModalStore } from "@/stores/useModalStore";
import { useEffect } from "react";
import { ERROR_EVENT_NAME, ErrorEventDetail } from "../apis/Client/Error";
import { Modal } from "@/app/components/Modal/Modal";
import { useLoadingStore } from "@/stores/useLoadingStore";

export default function GlobalModal() {
  const { isModalOpen, content, closeModal, openModal } = useModalStore();
  const { setIsLoading } = useLoadingStore();

  useEffect(() => {
    const handleError = (event: Event) => {
      const customEvent = event as CustomEvent<ErrorEventDetail>;
      const { message, statusCode } = customEvent.detail;
      setIsLoading(false);

      openModal(
        <ErrorModal
          message={message}
          statusCode={statusCode}
          onClose={closeModal}
        />
      );
    };

    window.addEventListener(ERROR_EVENT_NAME, handleError);

    return () => {
      window.removeEventListener(ERROR_EVENT_NAME, handleError);
    };
  }, [openModal, closeModal, setIsLoading]);

  return (
    <Modal isModalOpen={isModalOpen} onClose={closeModal}>
      {content}
    </Modal>
  );
}
