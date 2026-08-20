import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "@/api";

const DEFAULT_JOINS = [
  "job",
  "job.postedBy",
  "job.uploads",
  "job.currency",
  "job.category",
  "user",
];

interface UseInfiniteJobRequestsProps {
  search?: string;
  join?: string[];
  variant: "incoming" | "outgoing";
  statusFilter?: string;
}

export const useInfiniteJobRequests = ({
  search = "",
  join = DEFAULT_JOINS,
  variant,
  statusFilter,
}: UseInfiniteJobRequestsProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchRequests,
    isRefetching,
    isPending: isRequestsPending,
  } = useInfiniteQuery({
    queryKey: ["requests", search, variant, statusFilter],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: Record<string, string> = {
        page: String(pageParam),
        limit: "20",
        sort: "createdAt,desc",
        join: join.join(","),
      };

      if (search) queryParams.search = search;
      if (statusFilter) queryParams.filter = `status||$eq||${statusFilter}`;

      return variant === "incoming"
        ? api.jobRequest.findPaginatedIncoming(queryParams)
        : api.jobRequest.findPaginatedOngoing(queryParams);
    },
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.hasNextPage ? lastPage.meta.page + 1 : undefined,
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
