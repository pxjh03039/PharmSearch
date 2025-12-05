// components/Chat/ChatClearConfirm.tsx
"use client";

import { X } from "lucide-react";

interface ChatClearConfirmProps {
  closeModal: () => void;
  onConfirm: () => void;
}

export default function ChatClearConfirm({
  closeModal,
  onConfirm,
}: ChatClearConfirmProps) {
  const handleConfirm = async () => {
    await onConfirm();
    closeModal();
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">대화 삭제</h3>
        <button onClick={closeModal} className="modal-close-btn">
          <X className="icon-small" />
        </button>
      </div>
      <p className="modal-message">
        이전 대화 내용을 삭제하시겠습니까?
        <br />이 작업은 되돌릴 수 없습니다.
      </p>
      <div className="modal-actions">
        <button onClick={handleConfirm} className="modal-btn modal-btn-confirm">
          확인
        </button>
      </div>
    </div>
  );
}
