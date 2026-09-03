import { api } from "@/api";
import { TransactionType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseAddPointsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAddPoints = (props?: UseAddPointsProps) => {
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
        return api.finance.addPoints(args);
      }
      return api.finance.addPoints(args.amount, args.type, args.metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      props?.onSuccess?.();
    },
    onError: props?.onError,
  });
};
