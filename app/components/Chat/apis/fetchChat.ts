export type ChatRes = {
  conversationId?: string;
  answer?: string;
  text?: string;
};

export async function fetchChat(
  conversationId: string | "",
  prompt: string,
  signal?: AbortSignal
): Promise<ChatRes> {
  const resp = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId: conversationId || undefined,
      prompt,
    }),
    signal,
  });

  let data: ChatRes | null = null;
  try {
    data = await resp.json();
  } catch {
    // JSON이 아닐 수도 있으니 빈 처리
  }

  if (!resp.ok) {
    throw new Error((data as any)?.error || `Request failed (${resp.status})`);
  }
  return data || {};
}
