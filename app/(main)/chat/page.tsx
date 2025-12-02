"use client";

import Login from "@/app/components/Auth/Login";
import ChatInput from "@/app/components/Chat/ChatInput";
import ChatMessage from "@/app/components/Chat/ChatMessage";
import { useChat } from "@/app/components/Chat/hooks/useChat";
import { signIn, useSession } from "next-auth/react";

export default function ChatPage() {
  const { data: session } = useSession();
  const { messages, loading, onSend, clearChat } = useChat();

  if (!session) {
    return (
      <div className="login-container">
        <Login signIn={signIn} />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-main">
        <ChatMessage messages={messages} loading={loading} />
        <ChatInput
          loading={loading}
          onSend={onSend}
          hasMessages={messages.length > 0}
          onClear={clearChat}
        />
        <p className="chat-disclaimer">
          이 정보는 의사 진단을 대체하지 않습니다. 중요한 내용은 반드시
          검증하세요.
        </p>
      </div>
    </div>
  );
}
