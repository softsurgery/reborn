import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

interface useInfiniteJobsProps {
  search?: string;
  join?: string[];
  limit?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  userId?: string;
  follow?: boolean;
  enabled?: boolean;
}

export const useInfiniteJobs = (
  {
    limit = 20,
    sortKey = "createdAt",
    sortOrder = "desc",
    search = "",
    join = [],
    userId,
    follow = false,
    enabled = true,
  }: useInfiniteJobsProps = {
    limit: 20,
    sortKey: "createdAt",
    sortOrder: "desc",
    search: "",
    join: [],
    userId: undefined,
    follow: false,
    enabled: true,
  },
) => {
  const filter = React.useMemo(() => {
    let filter = [];
    if (userId) {
      filter.push(`postedById||$eq||${userId}`);
    }
    return filter.join(";");
  }, [search, userId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isPending: isJobsPending,
  } = useInfiniteQuery({
    queryKey: ["jobs", search, userId, follow],
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
      return follow
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
