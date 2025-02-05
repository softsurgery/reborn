import React from "react";
import { useQuery } from "@tanstack/react-query";
import { firebaseFns } from "~/firebase";

export function useWholeConvo(uid1: string, uid2: string, enabled?: boolean) {
  const { data: wholeConversationResp, isPending: isWholeConversationPending } =
    useQuery({
      queryKey: ["conversation", uid1, uid2],
      queryFn: () => firebaseFns.chat.fetchConversation(uid1, uid2),
      enabled,
    });

  const wholeConversation = React.useMemo(() => {
    return wholeConversationResp?.messages || [];
  }, [wholeConversationResp]);

  return { wholeConversation, isWholeConversationPending };
}
