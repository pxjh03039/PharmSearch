import { useState, useCallback } from "react";

type Role = "user" | "model";
type Msg = { id: string; role: Role; content: string };

export function useChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [conversationId, setConversationId] = useState("");
  const [loading, setLoading] = useState(false);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId("");
  }, []);

  const onSend = useCallback(
    async (text: string) => {
      const userMsg: Msg = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      setMessages((m) => [...m, userMsg]);
      setLoading(true);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20_000);
      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationId || undefined,
            prompt: text,
          }),
          signal: controller.signal,
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || "Request failed");

        if (!conversationId && data.conversationId) {
          setConversationId(data.conversationId);
        }

        const extracted = data?.answer ?? data?.text ?? "";
        const botMsg: Msg = {
          id: crypto.randomUUID(),
          role: "model",
          content: String(extracted),
        };
        setMessages((m) => [...m, botMsg]);
      } catch (e: any) {
        const botMsg: Msg = {
          id: crypto.randomUUID(),
          role: "model",
          content: `❗오류: ${e?.message ?? e}`,
        };
        setMessages((m) => [...m, botMsg]);
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    },
    [conversationId]
  );

  return { messages, setMessages, conversationId, loading, onSend, clearChat };
}
