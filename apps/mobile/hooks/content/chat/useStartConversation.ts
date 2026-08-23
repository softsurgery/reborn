import { api } from "@/api";
import { prependConversationToPages } from "@/lib/chat/chat";
import { CreateConversationDto, ResponseConversationDto } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface useStartConversationProps {
  onSuccess?: (conversation: ResponseConversationDto) => void;
  onMutate?: () => void;
  onSettled?: () => void;
  onError?: (error: any) => void;
}

/**
 * Hook providing a mutation to start or create a new conversation with a list of user IDs.
 */
export const useStartConversation = ({
  onSuccess,
  onMutate,
  onSettled,
  onError,
}: useStartConversationProps = {}) => {
  const queryClient = useQueryClient();

  const { mutate: startConversation, isPending: isStartingConversation } =
    useMutation({
      mutationKey: ["start-conversation"],
      mutationFn: (createConverstationDto: CreateConversationDto) =>
        api.chat.conversation.createConversation(createConverstationDto),
      onMutate,
      onSettled,
      onError,
      onSuccess: (conversation) => {
        queryClient.setQueriesData(
          { queryKey: ["conversations"], exact: false },
          (oldData) => prependConversationToPages(oldData as any, conversation),
        );
        onSuccess?.(conversation);
      },
    });

  return { startConversation, isStartingConversation };
};
