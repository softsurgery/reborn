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
  jobId?: string;
}

export const useInfiniteJobRequests = ({
  search = "",
  join = DEFAULT_JOINS,
  variant,
  statusFilter,
  jobId,
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
    queryKey: ["requests", variant, search, statusFilter, jobId],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: Record<string, string | string[]> = {
        page: String(pageParam),
        limit: "20",
        sort: "createdAt,desc",
        join: join.join(","),
      };

      if (search) queryParams.search = search;

      const filters: string[] = [];
      if (statusFilter) filters.push(`status||$eq||${statusFilter}`);
      if (jobId) filters.push(`job.id||$eq||${jobId}`);

      if (filters.length > 0) {
        queryParams.filter = filters;
      }

      return variant === "incoming"
        ? api.jobRequest.findPaginatedIncoming(queryParams as any)
        : api.jobRequest.findPaginatedOngoing(queryParams as any);
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
