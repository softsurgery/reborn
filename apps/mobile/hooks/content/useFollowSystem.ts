import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface useFollowSystemProps {
  id: string;
  use?: ("is-following" | "followers" | "followings")[];
  follow?: {
    onSuccess?: (data?: any, variables?: void, context?: any) => void;
    onError?: (error?: any, variables?: void, context?: any) => void;
  };
  unfollow?: {
    onSuccess?: (data?: any, variables?: void, context?: any) => void;
    onError?: (error?: any, variables?: void, context?: any) => void;
  };
}

export function useFollowSystem({
  id,
  use = [],
  follow,
  unfollow,
}: useFollowSystemProps) {
  const queryClient = useQueryClient();
  const {
    data: isFollowingResp,
    isPending: isIsFollowingPending,
    refetch: refetchIsFollowing,
  } = useQuery({
    queryKey: ["is-following", id],
    queryFn: () => api.follow.findIsFollowing(id),
    enabled: !!id && use.includes("is-following"),
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
    enabled: !!id && use.includes("followers"),
  });

  const followers = React.useMemo(() => followersResp || [], [followersResp]);

  const {
    data: followingsResp,
    isPending: isFollowingPending,
    refetch: refetchFollowing,
  } = useQuery({
    queryKey: ["followings", id],
    queryFn: () => api.follow.findFollowing(id),
    enabled: !!id && use.includes("followings"),
  });

  const followings = React.useMemo(
    () => followingsResp || [],
    [followingsResp]
  );

  const { mutate: followUser, isPending: isFollowPending } = useMutation({
    mutationFn: () => api.follow.followUser(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["is-following", id] });
      const previousIsFollowing = queryClient.getQueryData(["is-following", id]);
      queryClient.setQueryData(["is-following", id], { isFollowing: true });
      return { previousIsFollowing };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      if (follow?.onSuccess) follow.onSuccess(data, variables, context);
    },
    onError: (err, variables, context) => {
      if (context?.previousIsFollowing !== undefined) {
        queryClient.setQueryData(["is-following", id], context.previousIsFollowing);
      }
      if (follow?.onError) follow.onError(err, variables, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["is-following", id] });
    },
  });

  const { mutate: unfollowUser, isPending: isUnfollowPending } = useMutation({
    mutationFn: () => api.follow.unfollowUser(id!),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["is-following", id] });
      const previousIsFollowing = queryClient.getQueryData(["is-following", id]);
      queryClient.setQueryData(["is-following", id], { isFollowing: false });
      return { previousIsFollowing };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      if (unfollow?.onSuccess) unfollow.onSuccess(data, variables, context);
    },
    onError: (err, variables, context) => {
      if (context?.previousIsFollowing !== undefined) {
        queryClient.setQueryData(["is-following", id], context.previousIsFollowing);
      }
      if (unfollow?.onError) unfollow.onError(err, variables, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["is-following", id] });
    },
  });

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
    followings,
    isFollowingPending,
    refetchFollowing,
    //mutations
    followUser,
    isFollowPending,
    unfollowUser,
    isUnfollowPending,
  };
}
