import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

export interface UseBalanceProps {
  enabled?: boolean;
}

export const useBalance = (
  { enabled = true }: UseBalanceProps = { enabled: true },
) => {
  return useQuery({
    queryKey: ["finance", "balance"],
    queryFn: () => api.finance.getBalance(),
    enabled,
  });
};
