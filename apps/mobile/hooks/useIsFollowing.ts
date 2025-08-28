import { useQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface useIsFollowingProps {
  id: string;
  enabled?: boolean;
}

export function useIsFollowing({ id, enabled }: useIsFollowingProps) {
  const {
    data: isFollowingResp,
    isPending: isIsFollowingPending,
    refetch: refetchIsFollowing,
  } = useQuery({
    queryKey: ["is-following", id],
    queryFn: () => api.follow.findIsFollowing(id),
    enabled: !!id && enabled,
  });

  const isFollowing = React.useMemo(
    () => isFollowingResp?.isFollowing as boolean,
    [isFollowingResp]
  );

  return { isFollowing, isIsFollowingPending, refetchIsFollowing };
}
