import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UsePointTransactionsProps {
  enabled?: boolean;
}

export const usePointTransactions = (
  { enabled = true }: UsePointTransactionsProps = { enabled: true },
) => {
  return useInfiniteQuery({
    queryKey: ["finance", "transactions"],
    queryFn: ({ pageParam = 1 }) =>
      api.finance.getTransactions({
        page: pageParam.toString(),
        limit: "15",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.meta.pageCount ? nextPage : undefined;
    },
    enabled,
  });
};
