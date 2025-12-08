import mainClient from "@/app/common/apis/Client/mainClient";
import { API_ROUTES } from "@/app/common/apis/constants/routes";
import { MessageInput } from "@/app/common/types/constants";

export async function fetchPostMessage(message: MessageInput) {
  const res = await mainClient.post(API_ROUTES.conversationsMessages, message);

  return res;
}
