import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface useJobProps {
  id?: string;
  join?: string;
  enabled?: boolean;
}

export const useJob = ({ id, join, enabled = true }: useJobProps) => {
  const {
    data: jobResp,
    isPending: isJobPending,
    refetch: refetchJob,
  } = useQuery({
    queryKey: ["job", id, join],
    queryFn: () => api.job.findById(id, join),
    enabled: !!id && enabled,
  });

  const job = React.useMemo(() => {
    if (!jobResp) return null;
    return jobResp;
  }, [jobResp]);

  return {
    job,
    isJobPending,
    refetchJob,
  };
};
