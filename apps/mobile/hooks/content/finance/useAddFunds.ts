import { api } from "@/api";
import { TransactionType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseAddFundsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAddFunds = (props?: UseAddFundsProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      args:
        | number
        | {
            amount: number;
            type?: TransactionType;
            metadata?: Record<string, any>;
          },
    ) => {
      if (typeof args === "number") {
        return api.finance.addFunds(args);
      }
      return api.finance.addFunds(args.amount, args.type, args.metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      props?.onSuccess?.();
    },
    onError: props?.onError,
  });
};
