// ChatMessage.tsx
"use client";

import { motion } from "framer-motion";
import "./Chat.css";
import { Msg } from "@/app/common/types/constants";

type Props = {
  messages: Msg[];
  loading: boolean;
};

export default function ChatMessage({ messages, loading }: Props) {
  return (
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
  );
}
