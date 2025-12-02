export async function fetchPostChat(prompt: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("AI 응답을 받을 수 없습니다.");
  }

  return response.json();
}
