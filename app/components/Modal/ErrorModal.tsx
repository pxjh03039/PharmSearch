"use client";

import "./Modal.css";

type Props = {
  message: string;
  statusCode?: number;
  onClose: () => void;
};

export default function ErrorModal({ message, statusCode, onClose }: Props) {
  return (
    <div className="error_modal_container">
      <div className="error_modal_content">
        <div className="error_code">
          {message} (Code: {statusCode})
        </div>
      </div>
      <div className="error_modal_cta">
        <button className="error_btn" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
