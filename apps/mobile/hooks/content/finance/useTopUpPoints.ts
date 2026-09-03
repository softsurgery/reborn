import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseTopUpPointsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useTopUpPoints = (props?: UseTopUpPointsProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => api.finance.topUpPoints(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      props?.onSuccess?.();
    },
    onError: props?.onError,
  });
};
