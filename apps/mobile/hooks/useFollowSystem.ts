import { useQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface useFollowSystemProps {
  id: string;
  fetch: ("is-following" | "followers" | "following")[];
}

export function useFollowSystem({ id, fetch }: useFollowSystemProps) {
  const {
    data: isFollowingResp,
    isPending: isIsFollowingPending,
    refetch: refetchIsFollowing,
  } = useQuery({
    queryKey: ["is-following", id],
    queryFn: () => api.follow.findIsFollowing(id),
    enabled: !!id && fetch.includes("is-following"),
  });

  const isFollowing = React.useMemo(
    () => isFollowingResp?.isFollowing as boolean,
    [isFollowingResp]
  );

  const {
    data: followersResp,
    isPending: isFollowersPending,
    refetch: refetchFollowers,
  } = useQuery({
    queryKey: ["followers", id],
    queryFn: () => api.follow.findFollowers(id),
    enabled: !!id && fetch.includes("followers"),
  });

  const followers = React.useMemo(() => followersResp || [], [followersResp]);

  const {
    data: followingResp,
    isPending: isFollowingPending,
    refetch: refetchFollowing,
  } = useQuery({
    queryKey: ["following", id],
    queryFn: () => api.follow.findFollowing(id),
    enabled: !!id && fetch.includes("following"),
  });

  const following = React.useMemo(() => followingResp || [], [followingResp]);

  return {
    //is-following
    isFollowing,
    isIsFollowingPending,
    refetchIsFollowing,
    //followers
    followers,
    isFollowersPending,
    refetchFollowers,
    //following
    following,
    isFollowingPending,
    refetchFollowing,
  };
}
