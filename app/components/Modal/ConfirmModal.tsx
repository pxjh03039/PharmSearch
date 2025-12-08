"use client";

import "./Modal.css";

type Props = {
  closeModal: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirm: () => void;
};

export default function ConfirmModal({
  closeModal,
  title,
  message,
  confirmText = "확인",
  confirm,
}: Props) {
  const handleClick = async () => {
    await confirm();
    closeModal();
  };

  return (
    <>
      <div className="modal-title">{title}</div>
      <p className="modal-message">
        {message.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < message.split("\n").length - 1 && <br />}
          </span>
        ))}
      </p>
      <div className="modal-actions">
        <button onClick={handleClick} className="modal-btn modal-btn-confirm">
          {confirmText}
        </button>
      </div>
    </>
  );
}
