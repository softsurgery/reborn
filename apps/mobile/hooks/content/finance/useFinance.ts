import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { finance, PointTransaction } from "~/api/finance";

export const useBalance = () => {
  return useQuery({
    queryKey: ["finance", "balance"],
    queryFn: () => finance.getBalance(),
  });
};

export const usePointTransactions = () => {
  return useInfiniteQuery({
    queryKey: ["finance", "transactions"],
    queryFn: ({ pageParam = 1 }) =>
      finance.getTransactions({
        page: pageParam.toString(),
        limit: "15",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.meta.pageCount ? nextPage : undefined;
    },
  });
};
