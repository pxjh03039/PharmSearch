// hooks/useChat.ts
import { useState, useEffect } from "react";

export type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  createdAt: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  // 메시지 불러오기
  const loadMessages = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const conversation = await response.json();
        setMessages(conversation.messages || []);
      }
    } catch (error) {
      console.error("메시지 불러오기 실패:", error);
    }
  };

  // 메시지 추가
  const addMessage = async (content: string, role: "user" | "model") => {
    if (!content.trim()) return null;

    try {
      const response = await fetch("/api/conversations/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, role }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
      }
    } catch (error) {
      console.error("메시지 추가 실패:", error);
    }
    return null;
  };

  // 채팅 전송
  const onSend = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);

    // 사용자 메시지 추가
    await addMessage(text, "user");

    try {
      // AI 응답 받기
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          await addMessage(data.text, "model");
        }
      }
    } catch (error) {
      console.error("채팅 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 채팅 초기화
  const clearChat = async () => {
    try {
      const response = await fetch("/api/conversation", {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages([]);
      }
    } catch (error) {
      console.error("채팅 삭제 실패:", error);
    }
  };

  return {
    messages,
    loading,
    onSend,
    clearChat,
  };
}
