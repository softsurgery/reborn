import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface useJobStatisticsProps {
  id?: string;
  enabled?: boolean;
}

export const useJobStatistics = ({
  id,
  enabled = true,
}: useJobStatisticsProps) => {
  const {
    data: statistics,
    isPending: isStatisticsPending,
    isError: isStatisticsError,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: ["job-statistics", id],
    queryFn: () => api.jobStatistics.findById(id!),
    enabled: !!id && enabled,
  });

  return {
    statistics,
    isStatisticsPending,
    isStatisticsError,
    refetchStatistics,
  };
};
