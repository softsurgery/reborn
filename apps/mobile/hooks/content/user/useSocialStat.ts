import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";

interface UseSocialStatProps {
  userId?: string;
  enabled?: boolean;
}

export const useSocialStat = ({ userId, enabled = true }: UseSocialStatProps) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["social-data", userId],
    queryFn: () => api.follow.findDataCount(userId!),
    enabled: enabled && !!userId,
  });

  return { socialStat: data, isPending, refetch };
};
