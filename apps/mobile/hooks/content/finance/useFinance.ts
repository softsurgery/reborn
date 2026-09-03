import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { finance, PointTransaction, FundTransaction, TransactionType } from "~/api/finance";

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

export const useFundTransactions = () => {
  return useInfiniteQuery({
    queryKey: ["finance", "fund-transactions"],
    queryFn: ({ pageParam = 1 }) =>
      finance.getFundTransactions({
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

export const useAddFunds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      args: number | { amount: number; type?: TransactionType; metadata?: Record<string, any> }
    ) => {
      if (typeof args === "number") {
        return finance.addFunds(args);
      }
      return finance.addFunds(args.amount, args.type, args.metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
};

export const useAddPoints = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      args: number | { amount: number; type?: TransactionType; metadata?: Record<string, any> }
    ) => {
      if (typeof args === "number") {
        return finance.addPoints(args);
      }
      return finance.addPoints(args.amount, args.type, args.metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
};

export const useTopUpFunds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => finance.topUpFunds(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
};

export const useTopUpPoints = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => finance.topUpPoints(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
};
