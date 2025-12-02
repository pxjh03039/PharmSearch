export async function fetchGetConversation() {
  const response = await fetch("/api/conversations");

  if (!response.ok) {
    throw new Error("대화를 불러올 수 없습니다.");
  }

  return response.json();
}
