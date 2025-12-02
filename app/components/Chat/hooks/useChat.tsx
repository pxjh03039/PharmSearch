// hooks/useChat.ts
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

  // 대화 조회
  const { data: conversation, isLoading: isLoadingMessages } =
    useQuery<Conversation>({
      queryKey: ["conversation"],
      queryFn: fetchGetConversation,
    });

  const messages = conversation?.messages || [];

  // 메시지 추가 (낙관적 업데이트)
  const { mutateAsync: addMessage, isPending: isAddingMessage } = useMutation({
    mutationFn: fetchPostMessage,
    onMutate: async (newMessage: MessageInput) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["conversation"] });

      // 이전 데이터 스냅샷
      const previousConversation = queryClient.getQueryData<Conversation>([
        "conversation",
      ]);

      // 낙관적 업데이트
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
      // 에러 발생 시 롤백
      if (context?.previousConversation) {
        queryClient.setQueryData(
          ["conversation"],
          context.previousConversation
        );
      }
      console.error("메시지 추가 실패:", error);
    },
    onSettled: () => {
      // 성공/실패 관계없이 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
    },
  });

  // AI 채팅 전송
  const { mutateAsync: sendChat, isPending: isSendingChat } = useMutation({
    mutationFn: async (text: string) => {
      // 1. 사용자 메시지 추가
      await addMessage({ content: text, role: "user" });

      // 2. AI 응답 받기
      const data = await fetchPostChat(text);

      // 3. AI 메시지 추가
      if (data.text) {
        await addMessage({ content: data.text, role: "model" });
      }

      return data;
    },
  });

  // 대화 삭제
  const { mutateAsync: clearChat, isPending: isClearing } = useMutation({
    mutationFn: fetchDeleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
    },
  });

  // 간편한 전송 함수
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
    isLoading: isLoadingMessages || isSendingChat,
    onSend,
    clearChat,
    isClearing,
  };
}
