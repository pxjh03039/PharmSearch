"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Send, StopCircle } from "lucide-react";
import "./Chat.css";
import { useChat } from "./hooks/useChat";

export default function Chat() {
  const { messages, loading, onSend, clearChat } = useChat();

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
    <div className="chat-container">
      <div className="chat-main">
        <div className="chat-box">
          {messages.length === 0 && (
            <div className="placeholder-text">
              증상이나 약품에 대해 무엇이든 물어보세요.
            </div>
          )}

          {messages.map((m) => (
            <motion.article
              key={m.id}
              className={`chat-message ${m.role}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className={`chat-message-box ${m.role}`}>{m.content}</div>
            </motion.article>
          ))}

          {loading && (
            <div className="chat-loading">
              <span className="chat-dot" /> 생각 중...
            </div>
          )}
        </div>

        <div className="chat-composer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="무엇이든 물어보세요."
          />
          <button
            disabled={!canSend}
            onClick={handleSend}
            className="chat-send-btn"
          >
            {loading ? (
              <StopCircle className="icon-small" />
            ) : (
              <Send className="icon-small" />
            )}
          </button>
          {/* <button onClick={clearChat} className="clear-btn">
            <Trash2 className="icon-small" /> Clear
          </button> */}
        </div>

        <p className="chat-disclaimer">
          모델 출력은 부정확할 수 있습니다. 중요한 내용은 반드시 검증하세요.
        </p>
      </div>
    </div>
  );
}
