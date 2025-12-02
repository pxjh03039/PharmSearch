export async function fetchDeleteConversation() {
  const response = await fetch("/api/conversations", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("대화를 삭제할 수 없습니다.");
  }

  return response.json();
}
