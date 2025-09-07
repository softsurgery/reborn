import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface useRequestSystemProps {
  search: string;
  variant: "incoming" | "outgoing";
}

export const useRequestSystem = ({
  search,
  variant,
}: useRequestSystemProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchRequests,
    isRefetching,
    isPending: isRequestsPending,
  } = useInfiniteQuery({
    queryKey: ["requests", search, variant],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => {
      const queryParams = {
        page: String(pageParam),
        limit: "20",
        sort: "createdAt,desc",
        join: "job.postedBy,job.uploads",
      };
      return variant === "incoming"
        ? api.jobRequest.findPaginatedIncoming(queryParams)
        : api.jobRequest.findPaginatedOngoing(queryParams);
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const requests = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return {
    requests,
    isRequestsPending,
    refetchRequests,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  };
};
