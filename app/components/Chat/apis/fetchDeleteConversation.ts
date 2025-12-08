import mainClient from "@/app/common/apis/Client/mainClient";
import { API_ROUTES } from "@/app/common/apis/constants/routes";

export async function fetchDeleteConversation() {
  const res = await mainClient.delete(API_ROUTES.conversations);

  return res;
}
