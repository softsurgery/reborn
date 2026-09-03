import { api } from "@/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UseFundTransactionsProps {
  enabled?: boolean;
}

export const useFundTransactions = (
  { enabled = true }: UseFundTransactionsProps = { enabled: true },
) => {
  return useInfiniteQuery({
    queryKey: ["finance", "fund-transactions"],
    queryFn: ({ pageParam = 1 }) =>
      api.finance.getFundTransactions({
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
