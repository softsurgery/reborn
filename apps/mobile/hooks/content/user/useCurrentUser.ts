import { useQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface useCurrentUserProps {
  join?: string[];
}

export const useCurrentUser = ({ join = [] }: useCurrentUserProps = {}) => {
  const {
    data: currentUserResp,
    isPending: isCurrentUserPending,
    refetch: refetchCurrentUser,
  } = useQuery({
    queryKey: ["current-user", join],
    queryFn: () => api.client.findCurrent(join),
  });

  const currentUser = React.useMemo(() => {
    return currentUserResp || null;
  }, [currentUserResp]);

  return { currentUser, refetchCurrentUser, isCurrentUserPending };
};
