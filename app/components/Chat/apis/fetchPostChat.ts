import mainClient from "@/app/common/apis/Client/mainClient";
import { API_ROUTES } from "@/app/common/apis/constants/routes";

export async function fetchPostChat(text: string) {
  const res = await mainClient.post(API_ROUTES.chat, { prompt: text });

  return res;
}
