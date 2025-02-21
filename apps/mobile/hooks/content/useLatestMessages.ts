import React from "react";
import { useQuery } from "@tanstack/react-query";
import { firebaseFns } from "~/firebase";

export function useLatestMessages(
  uid1: string,
  uid2: string,
  limit: number = 1,
  enabled?: boolean
) {
  const { data: latestMessagesResp, isPending: isLatestMessagesPending } =
    useQuery({
      queryKey: ["latest-messages", uid1, uid2, limit],
      queryFn: () => firebaseFns.chat.getLatestMessages(uid1, uid2, limit),
      refetchInterval: 100,
      enabled : enabled && !!uid1 && !!uid2,
    });

  const latestMessages = React.useMemo(() => {
    return latestMessagesResp?.messages || [];
  }, [latestMessagesResp]);

  return { latestMessages, isLatestMessagesPending };
}
