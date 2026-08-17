import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { api } from "~/api";

interface useInfiniteSavedJobsProps {
  search?: string;
  join?: string;
}

export const useInfiniteSavedJobs = ({ search = "", join = "job.postedBy,job.uploads" }: useInfiniteSavedJobsProps = {
  search: "",
  join: "job.postedBy,job.uploads",
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchSavedJobs,
    isRefetching,
    isPending: isSavedJobsPending,
  } = useInfiniteQuery({
    queryKey: ["saved-jobs", search],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: Record<string, string> = {
        page: String(pageParam),
        limit: "20",
        sort: "createdAt,desc",
        join,
        search,
      };    
      return api.jobSave.findUserPaginated(queryParams);
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const savedJobs = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  return {
    savedJobs,
    isSavedJobsPending,
    refetchSavedJobs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  };
};
