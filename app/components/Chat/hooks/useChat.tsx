import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGetConversation } from "../apis/fetchGetConversation";
import { fetchPostMessage, MessageInput } from "../apis/fetchPostMessage";
import { fetchPostChat } from "../apis/fetchPostChat";
import { fetchDeleteConversation } from "../apis/fetchDeleteConversation";

export type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

export function useChat() {
  const queryClient = useQueryClient();

  const { data: conversation } = useQuery<Conversation>({
    queryKey: ["conversation"],
    queryFn: fetchGetConversation,
  });

  const messages = conversation?.messages || [];

  const { mutateAsync: addMessage } = useMutation({
    mutationFn: fetchPostMessage,
    onMutate: async (newMessage: MessageInput) => {
      await queryClient.cancelQueries({ queryKey: ["conversation"] });

      const previousConversation = queryClient.getQueryData<Conversation>([
        "conversation",
      ]);

      if (previousConversation) {
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          ...newMessage,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData<Conversation>(["conversation"], {
          ...previousConversation,
          messages: [...previousConversation.messages, optimisticMessage],
        });
      }

      return { previousConversation };
    },
    onError: (error, variables, context) => {
      if (context?.previousConversation) {
        queryClient.setQueryData(
          ["conversation"],
          context.previousConversation
        );
      }
      console.error("메시지 추가 실패:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
    },
  });

  const { mutateAsync: sendChat, isPending: isSendingChat } = useMutation({
    mutationFn: async (text: string) => {
      await addMessage({ content: text, role: "user" });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const data = await fetchPostChat(text);

      if (data.text) {
        await addMessage({ content: data.text, role: "model" });
      }

      return data;
    },
  });

  const { mutateAsync: clearChat, isPending: isClearing } = useMutation({
    mutationFn: fetchDeleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
    },
  });

  const onSend = async (text: string) => {
    if (!text.trim()) return;

    try {
      await sendChat(text);
    } catch (error) {
      console.error("채팅 전송 실패:", error);
    }
  };

  return {
    messages,
    isLoading: isSendingChat,
    onSend,
    clearChat,
    isClearing,
  };
}
