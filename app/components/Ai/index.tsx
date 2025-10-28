"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, StopCircle, User, Bot, Trash2 } from "lucide-react";
import "./Ai.css";

export default function ChatUI() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "model"; content: string }>
  >([]);
  const [conversationId, setConversationId] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function onSend() {
    if (!canSend) return;
    const text = input.trim();
    setInput("");

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId || undefined,
          prompt: text,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Request failed");
      if (!conversationId && data.conversationId)
        setConversationId(data.conversationId);

      const extracted = data?.answer ?? data?.text ?? "";
      const botMsg = {
        id: crypto.randomUUID(),
        role: "model" as const,
        content: String(extracted),
      };
      setMessages((m) => [...m, botMsg]);
    } catch (e: any) {
      const botMsg = {
        id: crypto.randomUUID(),
        role: "model" as const,
        content: `❗오류: ${e?.message ?? e}`,
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  }

  function clearChat() {
    setMessages([]);
    setConversationId("");
  }

  return (
    <div className="chat-container">
      <div className="chat-main">
        <div ref={viewportRef} className="chat-box">
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
          <div ref={bottomRef} />
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
            onClick={onSend}
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
