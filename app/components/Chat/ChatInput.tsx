// ChatInput.tsx
"use client";

import { useMemo, useState } from "react";
import { Send, Trash } from "lucide-react";
import { useModalStore } from "@/stores/useModalStore";
import ConfirmModal from "../Modal/ConfirmModal";

type Props = {
  loading: boolean;
  hasMessages: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
};

export default function ChatInput({
  loading,
  hasMessages,
  onSend,
  onClear,
}: Props) {
  const [input, setInput] = useState("");
  const { openModal, closeModal } = useModalStore();

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  };

  const handleClearClick = () => {
    openModal(
      <ConfirmModal
        closeModal={closeModal}
        confirm={onClear}
        title="대화 삭제"
        message={`이전 대화 내용을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
      />
    );
  };

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-composer">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="무엇이든 물어보세요."
      />
      <div className="chat-btn-group">
        <button disabled={!canSend} onClick={handleSend} className="chat-btn">
          <Send className="icon-small" />
        </button>
        <button
          disabled={!hasMessages || loading}
          onClick={handleClearClick}
          className="chat-btn"
        >
          <Trash className="icon-small" />
        </button>
      </div>
    </div>
  );
}
