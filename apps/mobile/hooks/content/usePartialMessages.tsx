import { useInfiniteQuery } from "@tanstack/react-query";
import { firebaseFns } from "~/firebase";

export function usePartialMessages(uid1: string, uid2: string, pageSize: number = 10) {
  const conversationId = uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["conversation", conversationId],
    queryFn: ({ pageParam = null }) =>
      firebaseFns.chat.fetchMessagesByPage(conversationId, pageParam, pageSize), // Pass lastMessageKey correctly
    getNextPageParam: (lastPage) => lastPage.lastKey || null, // Use lastKey for pagination
    initialPageParam: null,
  });

  // Flatten messages into a single array
  const messages = data?.pages.flatMap((page) => page.messages) || [];

  return { messages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading };
}
