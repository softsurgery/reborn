import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface useInfiniteViewedJobsProps {
  search?: string;
  join?: string;
}

export const useInfiniteViewedJobs = (
  {
    search = "",
    join = "job.postedBy,job.uploads",
  }: useInfiniteViewedJobsProps = {
    search: "",
    join: "job.postedBy,job.uploads",
  },
) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchViewedJobs,
    isRefetching,
    isPending: isViewedJobsPending,
  } = useInfiniteQuery({
    queryKey: ["viewed-jobs", search],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: Record<string, string> = {
        page: String(pageParam),
        limit: "20",
        sort: "updatedAt,desc",
        join,
        search,
      };
      return api.jobView.findUserPaginated(queryParams);
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const viewedJobs = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return {
    viewedJobs,
    isViewedJobsPending,
    refetchViewedJobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  };
};
