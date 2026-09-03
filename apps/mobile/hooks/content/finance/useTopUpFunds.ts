import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseTopUpFundsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useTopUpFunds = (props?: UseTopUpFundsProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => api.finance.topUpFunds(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      props?.onSuccess?.();
    },
    onError: props?.onError,
  });
};
