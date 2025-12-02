export type MessageInput = {
  content: string;
  role: "user" | "model";
};

export async function fetchPostMessage(message: MessageInput) {
  const response = await fetch("/api/conversations/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error("메시지를 저장할 수 없습니다.");
  }

  return response.json();
}
