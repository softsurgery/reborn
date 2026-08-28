import React from "react";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_JOINS = [
  "job",
  "job.postedBy",
  "job.uploads",
  "job.currency",
  "job.category",
  "user",
];

interface useJobRequestProps {
  id?: string;
  join?: string[];
  enabled?: boolean;
}

export const useJobRequest = ({
  id,
  join = DEFAULT_JOINS,
  enabled = true,
}: useJobRequestProps) => {
  const {
    data: requestResp,
    isPending: isRequestPending,
    isError: isRequestError,
    refetch: refetchRequest,
  } = useQuery({
    queryKey: ["job-request-details", id, join],
    queryFn: () => api.jobRequest.findById(Number(id), join.join(",")),
    enabled: !!id && enabled,
  });

  const request = React.useMemo(() => {
    if (!requestResp) return null;
    return requestResp;
  }, [requestResp]);

  return {
    request,
    isRequestPending,
    isRequestError,
    refetchRequest,
  };
};
