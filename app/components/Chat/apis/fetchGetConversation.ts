import mainClient from "@/app/common/apis/Client/mainClient";
import { API_ROUTES } from "@/app/common/apis/constants/routes";
import { Conversation } from "@/app/common/types/constants";

export async function fetchGetConversation() {
  const res = await mainClient.get<Conversation>(API_ROUTES.conversations);

  return res;
}
