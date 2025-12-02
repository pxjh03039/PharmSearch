// ChatInput.tsx
"use client";

import { useMemo, useState } from "react";
import { Send, Trash } from "lucide-react";

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
          onClick={onClear}
          className="chat-btn"
        >
          <Trash className="icon-small" />
        </button>
      </div>
    </div>
  );
}
