import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

interface useInfiniteJobsProps {
  search?: string;
  join?: string[];
  limit?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  filter?: string;
  followings?: boolean;
  enabled?: boolean;
}

export const useInfiniteJobs = (
  {
    limit = 20,
    sortKey = "createdAt",
    sortOrder = "desc",
    search = "",
    join = [],
    filter = "",
    followings = false,
    enabled = true,
  }: useInfiniteJobsProps = {
    limit: 20,
    search: "",
    sortKey: "createdAt",
    sortOrder: "desc",
    join: [],
    filter: "",
    followings: false,
    enabled: true,
  },
) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending: isJobsPending,
  } = useInfiniteQuery({
    queryKey: ["jobs", search, filter, followings],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const query = {
        page: String(pageParam),
        limit: String(limit),
        join: join.join(","),
        search,
        filter,
        sort: `${sortKey},${sortOrder}`,
      };
      return followings
        ? api.job.current.findFollowedPaginated(query)
        : api.job.findPaginated(query);
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const jobs = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return {
    jobs,
    isJobsPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  };
};
